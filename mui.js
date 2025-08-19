<Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  validateOnBlur={false}    // stop “errors on blur”
  validateOnChange={false}  // stop “errors while typing”
  onSubmit={handleSubmit}
>
  {({ resetForm, setErrors, setTouched, submitCount, errors, values, handleChange }) => (
    <form>
      {/* fields ... */}

      {/* show errors only after a submit */}
      {/* const show = (name) => submitCount > 0 && !!errors[name]; */}

      <button
        type="button"              // important: not a submit
        onClick={() => {
          resetForm();             // clears values, errors, touched, submitCount
          // belt-and-braces if you set custom errors elsewhere:
          setErrors({});
          setTouched({});
        }}
      >
        Clear all
      </button>
    </form>
  )}
</Formik>
