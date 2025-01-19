'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "@/components/react-hook-form/FormProvider";
import RHFTextField from "@/components/react-hook-form/RHFTextField";
import { Box, Typography, Button, Dialog } from "@mui/material";
import QrCodeIcon from '@mui/icons-material/QrCode';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { QRCodeCanvas } from "qrcode.react";
import { ineMockData } from "./dataFake";
import { LoadingButton } from "@mui/lab";

// hooks
import useStore from "./hooks/useStore";

export const FormDataINE = () => {
    const [qrData, setQrData] = useState("");
    const [data, setData] = useState("");
    const [open, setOpen] = useState(false);

    // Estados globales
    const { setActiveComponent, dataINE } = useStore();

    console.log(dataINE)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBackCamera = () => {
        setActiveComponent(false);
    };

    // Yup schema
    const Schema = yup.object().shape({
        nombres: yup.string()
            .matches(/^([^0-9_-]*)$/, "El nombre no debe contener números o caracteres especiales.")
            .required("Este campo debe estar lleno"),
        primer_apellido: yup.string()
            .matches(/^([^0-9_-]*)$/, "El apellido no debe contener números o caracteres especiales.")
            .required("Este campo debe estar lleno"),
        segundo_apellido: yup.string()
            .matches(/^([^0-9_-]*)$/, "El apellido no debe contener números o caracteres especiales.")
            .required("Este campo debe estar lleno"),
        curp: yup.string().required("Este campo debe estar lleno"),
        fecha_nacimiento: yup.string().required("Este campo debe estar lleno"),
    });

    // React Hook Form
    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues: {
            nombres: "",
            primer_apellido: "",
            segundo_apellido: "",
            curp: "",
            fecha_nacimiento: "",
            calle: "",
            cruzamiento_1: "",
            cruzamiento_2: "",
            numero_interior: "",
            numero_exterior: "",
            codigo_postal: "",
            colonia: "",
            estado: "",
            municipio: "",
        },
    });

    const { handleSubmit, setValue, formState: { isSubmitting }, control, reset } = methods;

    // Capitalizar textos
    const capitalize = (text) => {
        return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Lógica para llenar el formulario con ineMockData
    useEffect(() => {
        setValue("nombres", capitalize(dataINE?.Nombre || ''));
        setValue("primer_apellido", capitalize(dataINE?.PrimerApellido || ''));
        setValue("segundo_apellido", capitalize(dataINE?.SegundoApellido || ''));
        setValue("curp", dataINE?.CURP || '');
        setValue("fecha_nacimiento", dataINE?.FechaNacimiento || '');
        setValue("calle", capitalize(dataINE?.Domicilio || ''));

        setValue("cruzamiento_1", ineMockData.direccion.cruzamiento1);
        setValue("cruzamiento_2", ineMockData.direccion.cruzamiento2);
        setValue("numero_interior", ineMockData.direccion.numeroInterior);
        setValue("numero_exterior", ineMockData.direccion.numeroExterior);
        setValue("codigo_postal", ineMockData.direccion.codigoPostal);
        setValue("colonia", ineMockData.direccion.colonia);
        setValue("estado", ineMockData.direccion.estado);
        setValue("municipio", ineMockData.direccion.municipio);
    }, [setValue]);

    const onSubmit = async (data) => {
        const jsonData = encodeURIComponent(JSON.stringify(data));
        const decodedData = JSON.parse(decodeURIComponent(jsonData));
        setQrData(jsonData);
        setData(decodedData);
        handleClickOpen();
    };

    // Styles
    const commonStyles = {
        sx: {
            '& .MuiOutlinedInput-root': {
                borderRadius: "8px",
            },
        }
    };

    return (
        <div style={{ width: '100%', height: '100%', padding: '80px 20px' }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px' }}> Información obtenida </Typography>
                <Box sx={{
                    marginBottom: '30px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(104, 205, 249, 0.2), rgba(3, 81, 171, 0.2))',
                    borderRadius: '20px',
                    color: 'var(--secondary-blue)',
                    border: '1px solid var(--secondary-blue)'
                }}>
                    <Typography> Por favor, revisa y confirma que tus datos sean correctos. Realiza las correcciones necesarias antes de generar el código QR. </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}> Datos Generales </Typography>
                    <RHFTextField name="nombres" label="Nombres*" {...commonStyles} />
                    <RHFTextField name="primer_apellido" label="Primer Apellido*" {...commonStyles} />
                    <RHFTextField name="segundo_apellido" label="Segundo Apellido*" {...commonStyles} />
                    <RHFTextField name="curp" label="CURP*" {...commonStyles} inputProps={{ maxLength: 18 }} />
                    <RHFTextField name="fecha_nacimiento" label="Fecha de nacimiento*" {...commonStyles} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '40px' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}> Dirección </Typography>
                    <RHFTextField name="calle" label="Calle*" {...commonStyles} />
                    <RHFTextField name="cruzamiento_1" label="Cruzamiento 1*" {...commonStyles} />
                    <RHFTextField name="cruzamiento_2" label="Cruzamiento 2*" {...commonStyles} />
                    <RHFTextField name="numero_interior" label="Número interior*" {...commonStyles} />
                    <RHFTextField name="numero_exterior" label="Número exterior*" {...commonStyles} />
                    <RHFTextField name="codigo_postal" label="Código postal*" {...commonStyles} inputProps={{ maxLength: 5 }} />
                    <RHFTextField name="colonia" label="Colonia*" {...commonStyles} />
                    <RHFTextField name="estado" label="Estado*" {...commonStyles} />
                    <RHFTextField name="municipio" label="Municipio*" {...commonStyles} />
                </Box>
                <Box sx={{ display: 'flex', gap: '10px', marginTop: '30px', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <LoadingButton type="submit" loading={isSubmitting} startIcon={<QrCodeIcon />} variant="contained" color="success" sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '1rem' }}>
                        Generar QR
                    </LoadingButton>
                    <Button variant="contained" color="error" sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '1rem' }} onClick={handleBackCamera}>
                        Cancelar
                    </Button>
                </Box>
            </FormProvider>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <Box sx={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>Escanea para compartir:</Typography>
                    <QRCodeCanvas value={qrData} size={200} />
                    <Box sx={{
                        marginTop: '10px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, rgba(104, 205, 249, 0.2), rgba(3, 81, 171, 0.2))',
                        borderRadius: '10px',
                        color: 'var(--secondary-blue)',
                        border: '1px solid var(--secondary-blue)',
                        display: 'flex',
                        gap: '10px',
                        justifyContecnt: 'center',
                    }}>
                        <InfoOutlinedIcon />
                        <Typography sx={{ fontSize: '1rem' }}>Por seguridad, no compartas estos datos con terceros.</Typography>
                    </Box>

                </Box>

            </Dialog>
        </div >
    );
};
