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
                console.error('Error:', error.message);  // Muestra el mensaje de error
                console.error('Status Code:', error.status);  // Muestra el código de estado

                // Puedes lanzar un error con el mensaje y código, o manejarlo según sea necesario
                throw new Error(`Error ${error.status}: ${error.message}`);

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

