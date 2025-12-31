'use client';

import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaUser, FaSignOutAlt, FaChartLine, FaGraduationCap, FaLightbulb, FaFire, FaShieldAlt, FaRobot } from 'react-icons/fa';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <Container>
        <Navbar.Brand 
          onClick={() => router.push(user ? '/dashboard' : '/')} 
          style={{ 
            cursor: 'pointer',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--color-primary)',
            transition: 'all 0.3s ease'
          }}
        >
          <FaGraduationCap className="me-2" />
          PathForge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-2">
            {user && userData ? (
              <>
                <Nav.Link 
                  onClick={() => router.push('/dashboard')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  onClick={() => router.push('/templates')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  Templates
                </Nav.Link>
                <Nav.Link 
                  onClick={() => router.push('/roadmap')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  My Roadmaps
                </Nav.Link>
                <Nav.Link 
                  onClick={() => router.push('/skills')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  Skills
                </Nav.Link>
                <Nav.Link 
                  onClick={() => router.push('/projects')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  <FaLightbulb className="me-1" />
                  Projects
                </Nav.Link>
                <Nav.Link 
                  onClick={() => router.push('/trending')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  <FaFire className="me-1" />
                  Trending
                </Nav.Link>
                {process.env.NEXT_PUBLIC_ADMIN_UID && user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID && (
                  <Nav.Link 
                    onClick={() => router.push('/admin')}
                    style={{ 
                      color: '#E74C3C',
                      fontWeight: 'bold',
                      transition: 'color 0.3s'
                    }}
                  >
                    <FaShieldAlt className="me-1" />
                    Admin
                  </Nav.Link>
                )}
                <NavDropdown 
                  title={
                    <span>
                      <FaUser className="me-2" />
                      {userData.name}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item onClick={() => router.push('/profile')}>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link 
                  onClick={() => router.push('/login')}
                  style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}
                >
                  Login
                </Nav.Link>
                <Button 
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '600',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => router.push('/register')}
                  className="ms-2"
                >
                  Get Started
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
