import { Link, NavLink, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
//import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "./redux/auth/auth.selectors";
import { setUser } from "./redux/auth/auth.slice";
import { removeSession } from "./auth/utils";

export default function ResponsiveAppBar() {
  // תיקון שורש: קוראים את מצב ההתחברות מ-Redux (currentUser) במקום מ-getSession()/localStorage.
  // Redux מתעדכן באופן מיידי ואמין ברגע ההתחברות (dispatch(setUser(...))) בלי תלות בהצלחת
  // כתיבה ל-localStorage (שיכולה להיכשל, למשל בגלל מכסת אחסון) - וזה מה שגרם לנאבבר
  // להישאר "לא מחובר" גם אחרי התחברות מוצלחת.
  const currentUser = useSelector(selectAuth);
  const isLoggedIn = !!currentUser?.user?.id;
  const dispatch = useDispatch();
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [selectedNav, setSelectedRoute] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const navConfig = [
    {
      name: 'בית',
      route: '/home',
      isAthonticate: false
    },
  ];

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = async (data: string) => {
    setAnchorElUser(null);
    if (data === 'Logout') {
      // מנקים את המשתמש המחובר מה-Redux (כולל מה-storage המתמיד של redux-persist),
      // כדי שמסכים אחרים שקוראים מה-store לא ימשיכו להציג את המשתמש הקודם אחרי ההתנתקות.
      dispatch(setUser(null));
      removeSession();
      navigate('/home');
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>, route: string) => {
    navigate(route);
    setSelectedRoute(route);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'center' }}>
          <FitnessCenterIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            {navConfig.map((nav) => (
              <>
                <Button
                  key={nav.route}
                  onClick={(event) => handleOpenNavMenu(event, nav.route)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {nav.name}
                </Button>
              </>
            ))}

            {isLoggedIn && (
              <>
                <Button
                  key={'/exercise'}
                  onClick={(event) => handleOpenNavMenu(event, '/exercise')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  תרגילים
                </Button>
              </>
            )}
            {isLoggedIn && (
              <>
                <Button
                  key={'/personalZone'}
                  onClick={(event) => handleOpenNavMenu(event, '/personalZone')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  איזור אישי
                </Button>
              </>
            )}
            {isLoggedIn && currentUser?.user?.isCoach && (
              <>
                <Button
                  key={'/coachPersonalZone'}
                  onClick={(event) => handleOpenNavMenu(event, '/coachPersonalZone')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  אזור מאמנים
                </Button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <Button
                  key={'/signup2'}
                  onClick={(event) => handleOpenNavMenu(event, '/signup2')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  להרשמה/התחברות
                </Button>
              </>
            )}
          </Box>

          {isLoggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={currentUser?.user?.profilePicturePath || undefined} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
// import React, { useState } from "react";
// import { Link } from 'react-router-dom';
// //import { PATHS } from "../../routes/paths";
// import WarningIcon from '@mui/icons-material/Warning'; // אייקון אזהרה מ-MUI

// const SignUpMessage = () => {
//     const [hoveredSignUp, setHoveredSignUp] = useState(false);
//     const [hoveredLogin, setHoveredLogin] = useState(false);

//     const containerStyle: React.CSSProperties = {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         backgroundColor: 'white',
//         color: '#2196F3',
//         fontFamily: 'Arial, sans-serif',
//         textAlign: 'center',
//     };

//     const contentStyle: React.CSSProperties = {
//         maxWidth: '600px',
//         padding: '20px'
//     };

//     const headingStyle: React.CSSProperties = {
//         fontSize: '2.5em',
//         marginBottom: '20px' // מרווח בין הכותרת ללינק
//     };

//     const linkContainerStyle: React.CSSProperties = {
//         position: 'relative',
//         display: 'inline-block',
//         marginTop: '20px',
//         padding: '10px 20px',
//         backgroundColor: 'transparent',
//         color: '#2196F3',
//         textDecoration: 'none',
//         transition: 'color 0.3s',
//         fontSize: '2.5em', // גודל גדול יותר למילה "הירשם"
//         cursor: 'pointer',
//     };

//     const underlineStyle: React.CSSProperties = {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         bottom: '-4px',
//         borderBottom: '2px solid #1976D2',
//         transition: 'width 0.3s ease-in-out',
//     };

//     return (
//         <div style={containerStyle}>
//             <div style={contentStyle}>
//                 <WarningIcon style={{ fontSize: '8em', color: 'red', marginBottom: '10px' }} /> {/* אייקון אזהרה בצבע אדום */}
//                 <h2 style={headingStyle}>
//                     רק משתמש רשום יכול לפתוח אשכול חדש
//                 </h2>
//                 <div
//                     style={{ ...linkContainerStyle, marginBottom: '10px' }}
//                     onMouseEnter={() => setHoveredSignUp(true)}
//                     onMouseLeave={() => setHoveredSignUp(false)}
//                 >
//                     <Link to={'/signup2'} style={{ color: 'inherit', textDecoration: 'none' }}>
//                         הירשם
//                     </Link>
//                     <div style={{ ...underlineStyle, width: hoveredSignUp ? '100%' : '0%' }}></div>
//                 </div>
//                 <div
//                     style={linkContainerStyle}
//                     onMouseEnter={() => setHoveredLogin(true)}
//                     onMouseLeave={() => setHoveredLogin(false)}
//                 >
//                     <Link to={'/login'} style={{ color: 'inherit', textDecoration: 'none' }}>
//                         התחבר
//                     </Link>
//                     <div style={{ ...underlineStyle, width: hoveredLogin ? '100%' : '0%' }}></div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default SignUpMessage;
