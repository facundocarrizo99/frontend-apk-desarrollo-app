import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as yup from 'yup';
import { handleApiError } from '../utils/errorHandler';

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type FormTouched<T> = {
  [K in keyof T]?: boolean;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: yup.ObjectSchema<yup.AnyObject>;
  onSubmit: (values: T) => Promise<void> | void;
  onSuccess?: (result: any) => void;
  onError?: (error: unknown) => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  onSuccess,
  onError,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    async (field: keyof T, value: any) => {
      try {
        await validationSchema.validateAt(field as string, { [field]: value });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        return true;
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          setErrors((prev) => ({
            ...prev,
            [field]: error.message,
          }));
        }
        return false;
      }
    },
    [validationSchema]
  );

  const validateForm = useCallback(async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: FormErrors<T> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [validationSchema, values]);

  const handleChange = useCallback(
    (field: keyof T) => (value: any) => {
      setValues((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Validate the field if it's been touched
      if (touched[field]) {
        validateField(field, value);
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({
        ...prev,
        [field]: true,
      }));

      validateField(field, values[field]);
    },
    [values, validateField]
  );

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const setFieldTouched = useCallback((field: keyof T, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [field]: isTouched,
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      ) as FormTouched<T>;
      setTouched(allTouched);

      const isValid = await validateForm();
      if (!isValid) {
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await onSubmit(values);
        onSuccess?.(result);
      } catch (error) {
        console.error('Form submission error:', error);
        
        if (onError) {
          onError(error);
        } else {
          handleApiError(error, 'Error al enviar el formulario');
        }
        
        // Handle form-level errors from API
        if ((error as any)?.response?.data?.errors) {
          const apiErrors = (error as any).response.data.errors;
          const newErrors: FormErrors<T> = {};
          
          Object.keys(apiErrors).forEach((key) => {
            if (key in values) {
              newErrors[key as keyof T] = apiErrors[key][0];
            }
          });
          
          setErrors(newErrors);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, onSuccess, onError, values, validateForm]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    validateField,
    validateForm,
    setErrors,
    setTouched,
    setValues,
  };
}

export default useForm;
