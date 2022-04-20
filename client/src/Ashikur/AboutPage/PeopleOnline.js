import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Grid, Typography } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));


export default function PeopleOnline() {
    return (
        <Grid container spacing={2}alignItems="center">
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px'}}>  Emon Islam</Typography>
            </Grid>
            {/* online end */}
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px'}}>  Emon Islam</Typography>
            </Grid>
            {/* online end */}
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px',color:'inherit'}}>  Emon Islam</Typography>
            </Grid>
            {/* online end */}
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px'}}variant="inherit">  Emon Islam</Typography>
            </Grid>
            {/* online end */}
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px'}}>  Emon Islam</Typography>
            </Grid>
            {/* online end */}
          {/* online people start */}
            <Grid item xs={2}md={3}>
                <Stack>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </StyledBadge>
                </Stack>
            </Grid>
            <Grid item xs={10}md={9}>
            <Typography sx={{fontSize:'16px'}}>  Emon Islam</Typography>
            </Grid>
            {/* online end */}
        </Grid>
    );
}