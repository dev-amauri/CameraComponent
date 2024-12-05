import React from "react";
import { Box, Typography } from "@mui/material";

export default function Instructions() {
    return (
        <Box sx={{ width: '100%', height: '100%', padding: '80px 20px' }}>
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px' }}>Sugerencias</Typography>
            <Box sx={{
                marginBottom: '30px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(104, 205, 249, 0.2), rgba(3, 81, 171, 0.2))',
                borderRadius: '20px',
                color: 'var(--secondary-blue)',
                border: '1px solid var(--secondary-blue)'
            }}>
                <Typography sx={{ textAlign: 'justify' }}>
                    Estas instrucciones te ayudarán a obtener una foto adecuada de tu INE, asegurando mejores resultados en la obtención de datos.
                    <br />
                    <span style={{ fontWeight: 'bold' }}>¡Sigue los pasos y maximiza la calidad de la captura!</span>
                </Typography>
            </Box>

            {/* Instrucción 1 */}
            <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ textAlign: 'justify' }}>1. Coloca la INE en el área bordeada, centrada y visible.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', }}>
                    <img src="/illustration/position_correct.png" alt="image" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', }}>
                    <img src="/illustration/position_error.png" alt="image2" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
            </Box>

            {/* Instrucción 2 */}
            <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ textAlign: 'justify' }}>2. Usa un fondo claro, como una superficie blanca.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/background_correct.png" alt="Fondo" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/background_error.png" alt="Fondo2" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
            </Box>

            {/* Instrucción 3 */}
            <Box sx={{ marginBottom: '20px' }}>
                <Typography sx={{ textAlign: 'justify' }}>3. Evita sombras o reflejos; busca buena iluminación.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/light.png" alt="light" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/shadow.png" alt="shadow" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
            </Box>

            {/* Instrucción 4 */}
            <Box sx={{ marginBottom: '20px', textAlign: 'justify' }}>
                <Typography>4. Sostén la cámara recta y estable.</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/position_correct.png" alt="image" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <img src="/illustration/position_error2.png" alt="image" style={{ maxWidth: '80%', height: 'auto' }} />
                </Box>
            </Box>

            {/* Conclusión */}
            <Box sx={{ paddingBottom: '100px' }}>
                <Typography sx={{ fontWeight: 'bold' }}>¡Listo, toma la foto!</Typography>
            </Box>
        </Box>
    );
};
