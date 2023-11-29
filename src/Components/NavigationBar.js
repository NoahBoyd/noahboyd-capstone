import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import '../App.css';
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

function NavigationBar({setUserData}) {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);
    const [expanded, setExpanded] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['userAuthenticated']);
    const userAuthenticated = cookies.userAuthenticated !== undefined;
    const navigate = useNavigate();
    

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = async () => {
        await removeCookie('userAuthenticated');
        localStorage.removeItem('userData');
        await setUserData(null);
        navigate('/');
    };
    

    return (
        <Navbar expand="lg" expanded={expanded} className=" navigationbar pagenav">
            <Container className=''>
                <Navbar.Brand><NavLink to={userAuthenticated ? '/home' : '/'} className={"navigationBarLink"}>Family Cookbook</NavLink></Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : true)} aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto"></Nav>
                    <Nav pullRight>
                        {userAuthenticated ? ( // USER IS AUTHENTICATED
                            <>
                            <Nav.Link onClick={() => setExpanded(false)}>
                            <NavLink to="/home" className={"navigationBarLink"}>Home</NavLink>
                            </Nav.Link>
                            <Nav.Link onClick={() => setExpanded(false)}>
                            <NavLink to="/profile" className={"navigationBarLink"}>Profile</NavLink>
                            </Nav.Link>
                            <Nav.Link onClick={() => setExpanded(false)} className={!isSmallScreen ? 'border border-dark rounded' : ''} style={!isSmallScreen ? { paddingLeft: '1rem', paddingRight: '1rem', marginLeft: '2rem' } : {}}>
                                <NavLink onClick={handleLogout} className={"navigationBarLink"}>Logout</NavLink>
                            </Nav.Link>
                            </>
                        ) : ( // USER IS NOT AUTHENTICATED
                            <>
                            <Nav.Link onClick={() => setExpanded(false)}>
                            <NavLink to="/login" className={"navigationBarLink"}>Login</NavLink>
                            </Nav.Link>
                            <Nav.Link onClick={() => setExpanded(false)} className={!isSmallScreen ? 'border border-dark rounded' : ''} style={!isSmallScreen ? { paddingLeft: '1rem', paddingRight: '1rem', marginLeft: '2rem' } : {}}>
                                <NavLink to="/signup" className={"navigationBarLink"}>Signup</NavLink>
                            </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;