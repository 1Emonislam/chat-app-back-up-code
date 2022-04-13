import { Box, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3 }}>
                <div>
                    <Typography sx={{
                        fontSize: {
                            lg: '24px',
                            md: '20px',
                            sm: '18px',
                            xs: "16px"
                        }, color: '#ffffff', fontWeight: 'bold', letterSpacing: 1.6
                    }}>Collaball</Typography>
                </div>
                <div>
                    <Button sx={{
                        marginRight: {
                            lg: '15px',
                            md: '10px',
                            sm: '3px',
                            xs: "2px"
                        },
                        fontSize: {
                            lg: '14px',
                            md: '14px',
                            sm: '14px',
                            xs: "12px"
                        },
                        background: '#fff',
                        textTransform: 'capitalize',
                        color: 'black',
                        borderRadius: '40px',
                        padding: '6px 16px !important',

                        '&:hover': {
                            color: 'blue',
                            background: '#ffffff',
                            boxShadow: '1px 1px 1px #ffffff'
                        }

                    }}><NavLink to="/login">Login</NavLink></Button>
                    <Button sx={{
                        marginRight: {
                            lg: '15px',
                            md: '10px',
                            sm: '3px',
                            xs: "2px"
                        },
                        fontSize: {
                            lg: '14px',
                            md: '14px',
                            sm: '14px',
                            xs: "12px"
                        },
                        background: '#fff',
                        textTransform: 'capitalize',
                        color: 'black',
                        borderRadius: '40px',
                        padding: '6px 16px !important',

                        '&:hover': {
                            color: 'blue',
                            background: '#ffffff',
                            boxShadow: '1px 1px 1px #ffffff'
                        }

                    }}><NavLink to="/register">Register</NavLink></Button>
                </div>

            </Box>
        </Container >
    );
};

export default Header;