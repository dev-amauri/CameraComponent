'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import api from '@/utils/api';
import useStore from './useStore';

// sweet alert
import Swal from 'sweetalert2';

const queryKey = ['ocr'];

const useMutationOCR = () => {
    const queryClient = useQueryClient();
    const { setIsError } = useStore();

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

                setIsError(true);
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

