'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '@/utils/api';

// sweet alert
import Swal from 'sweetalert2';

const queryKey = ['ocr'];

const useMutationOCR = () => {
    const queryClient = useQueryClient();

    const postINE = (data) => (
        api.ocr.postOCR(data)
            .then((response) => {
                if (response.status === 200) {
                    console.log('Awuebo')
                }
                return response.data
            })
            .catch((error) => {
                // Aplicar Sweet Alert en caso de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: '¡Ups! La imagen no tiene suficiente calidad. Intenta con una mejor.',
                    confirmButtonText: 'Aceptar'
                });
                return null;
            })
    );

    // mutates

    const mutatePostINE = useMutation({
        mutationFn: postINE, // Pasando la función como mutationFn
        onSuccess: () => {
          queryClient.invalidateQueries(queryKey); // Invalidar Query y hacer refresh
        },
      });


    return {
        OCR: {
            post: mutatePostINE,
        },
    };
};

export default useMutationOCR;

