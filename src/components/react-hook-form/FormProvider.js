import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

FormProvider.propTypes = {
  children: PropTypes.node,
  methods: PropTypes.object,
  onSubmit: PropTypes.func,
};

export default function FormProvider({ children, onSubmit, methods }) {
  // Evento para prevenir el envío de formulario cuando se presiona Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} onKeyDown={handleKeyDown}>
        {children}
      </form>
    </Form>
  );
}