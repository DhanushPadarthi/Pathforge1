'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar, Badge, Accordion, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Header from '@/components/Header';
import StarRating from '@/components/StarRating';
import { roadmapAPI, apiRequest } from '@/lib/api';
import { FaCheckCircle, FaLock, FaPlay, FaExternalLinkAlt, FaClock, FaBook, FaForward, FaStar } from 'react-icons/fa';

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  estimated_hours: number;
  resource_type: string;
  status: string;
  order: number;
  completed_at?: string;
  time_spent_seconds?: number;
  opened_at?: string;
  rating?: number;
  rating_count?: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  skills_covered: string[];
  week_number?: number;
  resources: Resource[];
  estimated_total_hours: number;
  order: number;
  is_completed: boolean;
}

interface Roadmap {
  _id: string;
  user_id: string;
  target_role: string;
  skill_gaps: string[];
  modules: Module[];
  total_estimated_hours: number;
  deadline: string;
  progress_percentage: number;
  current_module_index: number;
  created_at: string;
  updated_at: string;
}

export default function RoadmapDetailPage() {
  const { user, userData, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  const params = useParams();
  const roadmapId = params.id as string;
  
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  const [error, setError] = useState('');
  const [activeAccordionKey, setActiveAccordionKey] = useState<string | null>(null);
  
  // Module summary state
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [moduleSummaries, setModuleSummaries] = useState<any[]>([]);
  
  // Rating state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingResource, setRatingResource] = useState<Resource | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  
  // Time tracking state
  const [activeResource, setActiveResource] = useState<{ moduleId: string; resourceId: string } | null>(null);
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Split-screen view state
  const [openedResource, setOpenedResource] = useState<{ url: string; title: string; moduleId: string; resourceId: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    if (!loading && userData?._id && !hasFetched) {
      fetchRoadmap();
    }
  }, [user, loading, userData?._id, hasFetched]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, []);

  const fetchRoadmap = async (showLoading = true) => {
    if (!userData?._id) {
      setLoadingRoadmap(false);
      return;
    }
    
    try {
      if (showLoading) {
        setLoadingRoadmap(true);
      }
      setHasFetched(true);
      const roadmaps = await roadmapAPI.getUserRoadmaps(userData._id);
      
      // Find the specific roadmap by ID from the array
      const foundRoadmap = Array.isArray(roadmaps) 
        ? roadmaps.find(r => r._id === params.id)
        : roadmaps;
      
      if (!foundRoadmap) {
        setError('Roadmap not found');
        setLoadingRoadmap(false);
        return;
      }
      
      // Force re-render by deep cloning (shallow copy doesn't work for nested arrays)
      const clonedRoadmap = JSON.parse(JSON.stringify(foundRoadmap));
      console.log('[FETCH] Setting roadmap state:', {
        totalModules: clonedRoadmap.modules?.length,
        currentModuleIndex: clonedRoadmap.current_module_index,
        progress: clonedRoadmap.progress_percentage
      });
      setRoadmap(clonedRoadmap);
      
      // Set default active accordion key only on first load
      // NOTE: Do NOT reset accordion during subsequent fetches - it breaks navigation!
      if (activeAccordionKey === null) {
        console.log('[FETCH] First load - setting accordion to current module:', foundRoadmap.current_module_index);
        setActiveAccordionKey(String(foundRoadmap.current_module_index));
      }
      
      // Initialize time spent from backend, preserving active timer
      setTimeSpent(prev => {
        const newTimeSpent: Record<string, number> = {};
        (foundRoadmap.modules || []).forEach((module: Module) => {
          (module.resources || []).forEach((resource: Resource) => {
            const key = `${module.id}-${resource.id}`;
            // If this resource has an active timer, keep the current value
            if (activeResource?.moduleId === module.id && activeResource?.resourceId === resource.id) {
              newTimeSpent[key] = prev[key] || resource.time_spent_seconds || 0;
            } else {
              newTimeSpent[key] = resource.time_spent_seconds || 0;
            }
          });
        });
        return newTimeSpent;
      });
      
      setError('');
    } catch (err: any) {
      console.error('Error fetching roadmap:', err);
      setError(err.message || 'Failed to load roadmap');
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleOpenResource = async (moduleId: string, resourceId: string, url: string) => {
    if (!roadmap?._id) {
      return;
    }
    
    try {
      // Mark as opened in backend
      await roadmapAPI.openResource(roadmap._id, moduleId, resourceId);
      
      // Start time tracking
      setActiveResource({ moduleId, resourceId });
      console.log('[OPEN] Time tracking started');
      
      // Start interval to update time every second
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      
      timeIntervalRef.current = setInterval(async () => {
        const key = `${moduleId}-${resourceId}`;
        
        // Use functional update to avoid stale closure
        setTimeSpent(prev => {
          const currentTime = prev[key] || 0;
          const newTime = currentTime + 1;
          
          // Update backend every 30 seconds
          if (newTime % 30 === 0) {
            roadmapAPI.updateTimeSpent(roadmap._id, moduleId, resourceId, newTime)
              .then(result => {
                if (result.auto_completed) {
                  // Resource was auto-completed, refresh roadmap
                  if (timeIntervalRef.current) {
                    clearInterval(timeIntervalRef.current);
                  }
                  setActiveResource(null);
                  fetchRoadmap(false);
                }
              })
              .catch(err => {
                console.error('Failed to update time:', err);
              });
          }
          
          return { ...prev, [key]: newTime };
        });
      }, 1000);
      
      // Open resource in split-screen view
      console.log('[OPEN] Opening resource in split-screen:', { moduleId, resourceId, url });
      
      // Validate YouTube URL if it's a YouTube video - but be lenient with warnings
      let validatedUrl = url;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
          // Try to extract video ID - support multiple YouTube URL formats
          let videoId = '';
          const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
          if (youtubeMatch && youtubeMatch[1]) {
            videoId = youtubeMatch[1];
            validatedUrl = `https://www.youtube.com/watch?v=${videoId}`;
            console.log('[OPEN] Extracted YouTube video ID:', videoId);
            
            // Try to check video availability (but be lenient - only warn on definite errors)
            try {
              // Use a timeout to prevent hanging
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);
              
              const videoCheckRes = await fetch(
                `https://noembed.com/embed?url=${encodeURIComponent(validatedUrl)}`,
                { signal: controller.signal }
              );
              clearTimeout(timeoutId);
              
              if (!videoCheckRes.ok) {
                // HTTP error (like 404) means video is likely not available
                console.warn('[OPEN] YouTube video not found (HTTP ' + videoCheckRes.status + ')');
                showError('⚠️ This video appears to be unavailable. It may have been removed or made private.');
              } else {
                const videoData = await videoCheckRes.json();
                // Only warn if we get an explicit error from the API
                if (videoData.error) {
                  console.warn('[OPEN] YouTube video unavailable:', videoData.error);
                  showError('⚠️ This video appears to be unavailable on YouTube.');
                }
                // If we get any response without error, consider it available
              }
            } catch (err: any) {
              // If we can't verify (timeout, network error, etc.), assume it's available
              // Don't warn unless we're certain it's unavailable
              console.log('[OPEN] Could not verify video availability (assuming available):', err.message);
            }
          } else {
            // If we can't extract video ID, just use the URL as-is
            console.log('[OPEN] Could not extract YouTube video ID from:', url);
          }
        } catch (err) {
          console.warn('[OPEN] Error validating YouTube URL:', err);
          // Continue with original URL
        }
      }
      
      // Find the resource title and set everything at once
      let resourceTitle = '';
      if (roadmap) {
        for (const mod of roadmap.modules) {
          if (mod.id === moduleId) {
            for (const res of mod.resources) {
              if (res.id === resourceId) {
                resourceTitle = res.title;
                console.log('[OPEN] Found resource:', { 
                  moduleTitle: mod.title,
                  resourceTitle: res.title,
                  moduleId: mod.id,
                  resourceId: res.id
                });
                break;
              }
            }
            break;
          }
        }
      }
      
      // Set all openedResource data at once to avoid race conditions
      setOpenedResource({
        url: validatedUrl,
        title: resourceTitle,
        moduleId,
        resourceId
      });
      
      console.log('[OPEN] openedResource set to:', {
        url: validatedUrl,
        title: resourceTitle,
        moduleId,
        resourceId
      });
    } catch (err: any) {
      console.error('[OPEN] Error opening resource:', err);
      setError(err.message || 'Failed to open resource');
    }
  };

  const handleCompleteResource = async (moduleId: string, resourceId: string, event?: React.MouseEvent) => {
    if (!roadmap?._id) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('[COMPLETE] Starting complete resource:', { moduleId, resourceId, roadmapId: roadmap._id });
    
    // Find current module and resource index BEFORE any API calls
    let moduleIndex = -1;
    let resourceIndex = -1;
    let foundModule = null;
    let nextModuleIndex = -1;
    let nextResourceIndex = -1;
    let nextModuleId = '';
    let nextResourceId = '';
    let nextResourceUrl = '';
    
    for (let i = 0; i < roadmap.modules.length; i++) {
      const mod = roadmap.modules[i];
      if (mod.id === moduleId) {
        foundModule = mod;
        moduleIndex = i;
        for (let j = 0; j < mod.resources.length; j++) {
          if (mod.resources[j].id === resourceId) {
            resourceIndex = j;
            break;
          }
        }
        break;
      }
    }
    
    // BEFORE API call, determine next resource using current data
    if (foundModule && resourceIndex !== -1) {
      // Look for next resource in same module
      for (let i = resourceIndex + 1; i < foundModule.resources.length; i++) {
        const res = foundModule.resources[i];
        if (res.status !== 'completed' && res.status !== 'skipped') {
          nextModuleIndex = moduleIndex;
          nextResourceIndex = i;
          nextModuleId = foundModule.id;
          nextResourceId = res.id;
          nextResourceUrl = res.url;
          console.log('[COMPLETE] Found next resource in same module:', { nextModuleIndex, nextResourceIndex });
          break;
        }
      }
    }
    
    // If no next resource in current module, find in next modules
    if (nextResourceIndex === -1) {
      for (let i = moduleIndex + 1; i < roadmap.modules.length; i++) {
        const mod = roadmap.modules[i];
        if (mod.resources && mod.resources.length > 0) {
          const firstResource = mod.resources[0];
          if (firstResource.status !== 'completed' && firstResource.status !== 'skipped') {
            nextModuleIndex = i;
            nextResourceIndex = 0;
            nextModuleId = mod.id;
            nextResourceId = firstResource.id;
            nextResourceUrl = firstResource.url;
            console.log('[COMPLETE] Found next resource in next module:', { nextModuleIndex, nextResourceIndex });
            break;
          }
        }
      }
    }
    
    try {
      // Stop time tracking if active
      if (activeResource?.moduleId === moduleId && activeResource?.resourceId === resourceId) {
        console.log('[COMPLETE] Stopping timer for active resource');
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
        setActiveResource(null);
      }
      
      console.log('[COMPLETE] Calling API...');
      const result = await roadmapAPI.completeResource(roadmap._id, moduleId, resourceId);
      console.log('[COMPLETE] API response:', result);
      
      // Check if module summaries were generated
      if (result.module_summaries && result.module_summaries.length > 0) {
        console.log('[COMPLETE] Module summaries generated');
        setModuleSummaries(result.module_summaries);
        setShowSummaryModal(true);
      }
      
      console.log('[COMPLETE] Refreshing roadmap...');
      await fetchRoadmap(false);
      
      // Navigate to the next resource we found BEFORE the API call
      if (nextResourceIndex !== -1 && nextModuleId && nextResourceId) {
        console.log('[COMPLETE] Navigating to next resource:', { nextModuleIndex, nextResourceIndex });
        setActiveAccordionKey(String(nextModuleIndex));
        handleOpenResource(nextModuleId, nextResourceId, nextResourceUrl);
      } else {
        console.log('[COMPLETE] No more resources, staying in current module:', moduleIndex);
        setActiveAccordionKey(String(moduleIndex));
      }
      
      console.log('[COMPLETE] Complete success!');
      showSuccess('Resource completed successfully!');
    } catch (err: any) {
      console.error('[COMPLETE] Failed to complete resource:', err);
      setError(err.message || 'Failed to complete resource');
      showError(err.message || 'Failed to complete resource');
    }
  };


  const handleSkipResource = async (moduleId: string, resourceId: string, event?: React.MouseEvent) => {
    if (!roadmap?._id) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('[SKIP] Starting skip resource:', { 
      moduleId, 
      resourceId,
      roadmapId: roadmap._id
    });
    
    // Find current module and resource index BEFORE any API calls
    let foundResource = null;
    let foundModule = null;
    let moduleIndex = -1;
    let resourceIndex = -1;
    let nextModuleIndex = -1;
    let nextResourceIndex = -1;
    let nextModuleId = '';
    let nextResourceId = '';
    let nextResourceUrl = '';
    
    for (let i = 0; i < roadmap.modules.length; i++) {
      const mod = roadmap.modules[i];
      if (mod.id === moduleId) {
        foundModule = mod;
        moduleIndex = i;
        for (let j = 0; j < mod.resources.length; j++) {
          const res = mod.resources[j];
          if (res.id === resourceId) {
            foundResource = res;
            resourceIndex = j;
            break;
          }
        }
        break;
      }
    }
    
    console.log('[SKIP] Found resource:', { moduleIndex, resourceIndex, resourceId });
    
    // BEFORE API call, determine next resource using current data
    if (foundModule && resourceIndex !== -1) {
      // Look for next resource in same module
      for (let i = resourceIndex + 1; i < foundModule.resources.length; i++) {
        const res = foundModule.resources[i];
        if (res.status !== 'completed' && res.status !== 'skipped') {
          nextModuleIndex = moduleIndex;
          nextResourceIndex = i;
          nextModuleId = foundModule.id;
          nextResourceId = res.id;
          nextResourceUrl = res.url;
          console.log('[SKIP] Found next resource in same module:', { nextModuleIndex, nextResourceIndex });
          break;
        }
      }
    }
    
    // If no next resource in current module, find in next modules
    if (nextResourceIndex === -1) {
      for (let i = moduleIndex + 1; i < roadmap.modules.length; i++) {
        const mod = roadmap.modules[i];
        if (mod.resources && mod.resources.length > 0) {
          const firstResource = mod.resources[0];
          if (firstResource.status !== 'completed' && firstResource.status !== 'skipped') {
            nextModuleIndex = i;
            nextResourceIndex = 0;
            nextModuleId = mod.id;
            nextResourceId = firstResource.id;
            nextResourceUrl = firstResource.url;
            console.log('[SKIP] Found next resource in next module:', { nextModuleIndex, nextResourceIndex });
            break;
          }
        }
      }
    }
    
    try {
      // Stop time tracking if active
      if (activeResource?.moduleId === moduleId && activeResource?.resourceId === resourceId) {
        console.log('[SKIP] Stopping timer for active resource');
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
        setActiveResource(null);
      }
      
      console.log('[SKIP] Calling API...');
      const result = await roadmapAPI.skipResource(roadmap._id, moduleId, resourceId);
      console.log('[SKIP] API response:', result);
      
      // Check if module summaries were generated
      if (result.module_summaries && result.module_summaries.length > 0) {
        console.log('[SKIP] Module summaries generated');
        setModuleSummaries(result.module_summaries);
        setShowSummaryModal(true);
      }
      
      console.log('[SKIP] Refreshing roadmap...');
      await fetchRoadmap(false);
      
      // Navigate to the next resource we found BEFORE the API call
      if (nextResourceIndex !== -1 && nextModuleId && nextResourceId) {
        console.log('[SKIP] Navigating to next resource:', { nextModuleIndex, nextResourceIndex });
        setActiveAccordionKey(String(nextModuleIndex));
        handleOpenResource(nextModuleId, nextResourceId, nextResourceUrl);
      } else {
        console.log('[SKIP] No more resources, staying in current module:', moduleIndex);
        setActiveAccordionKey(String(moduleIndex));
      }
      
      console.log('[SKIP] Skip complete!');
      showSuccess('Resource skipped successfully!');
    } catch (err: any) {
      console.error('[SKIP] Failed to skip resource:', err);
      setError(err.message || 'Failed to skip resource');
      showError(err.message || 'Failed to skip resource');
    }
  };

  const handleRateResource = (resource: Resource) => {
    setRatingResource(resource);
    setUserRating(0);
    setRatingComment('');
    setShowRatingModal(true);
  };

  const submitRating = async () => {
    if (!ratingResource || userRating === 0) return;
    
    try {
      setSubmittingRating(true);
      await apiRequest(`/api/roadmaps/${roadmapId}/rate-resource?user_id=${userData!._id}&resource_url=${encodeURIComponent(ratingResource.url)}`, {
        method: 'POST',
        body: JSON.stringify({
          rating: userRating,
          comment: ratingComment || undefined
        })
      });
      
      showSuccess('Rating submitted successfully!');
      setShowRatingModal(false);
      await fetchRoadmap(false);
    } catch (error) {
      console.error('Failed to rate resource:', error);
      showError('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // -------------------------
  // Provider detection system
  // -------------------------
  type Provider = {
    match: (url: string) => boolean;
    getEmbedUrl: (url: string) => string | null;
  };

  const PROVIDERS: Provider[] = [
    // YouTube watch?v=
    {
      match: (url) => url.includes('youtube.com/watch'),
      getEmbedUrl: (url) => {
        try {
          const vid = new URL(url).searchParams.get('v');
          return vid ? `https://www.youtube.com/embed/${vid}` : null;
        } catch {
          return null;
        }
      }
    },
    // youtu.be short links
    {
      match: (url) => url.includes('youtu.be/'),
      getEmbedUrl: (url) => {
        const after = url.split('youtu.be/')[1];
        if (!after) return null;
        const id = after.split(/[?\/]/)[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    },
    // Already embed url for YouTube
    {
      match: (url) => url.includes('youtube.com/embed/'),
      getEmbedUrl: (url) => url
    },
    // Vimeo
    {
      match: (url) => url.includes('vimeo.com/'),
      getEmbedUrl: (url) => {
        const after = url.split('vimeo.com/')[1];
        if (!after) return null;
        const id = after.split(/[?\/]/)[0];
        return id && !isNaN(Number(id)) ? `https://player.vimeo.com/video/${id}` : null;
      }
    },
    // CodePen embed
    {
      match: (url) => url.includes('codepen.io') && url.includes('/embed/'),
      getEmbedUrl: (url) => url
    },
    // CodeSandbox embed
    {
      match: (url) => url.includes('codesandbox.io/embed/'),
      getEmbedUrl: (url) => url
    },
    // PDF files - use browser's PDF viewer
    {
      match: (url) => url.toLowerCase().endsWith('.pdf') || url.includes('.pdf?'),
      getEmbedUrl: (url) => url
    },
    // Google Docs viewer for PDFs and documents
    {
      match: (url) => url.includes('docs.google.com') || url.includes('drive.google.com'),
      getEmbedUrl: (url) => {
        if (url.includes('/preview') || url.includes('/embed')) {
          return url;
        }
        return url.replace('/view', '/preview');
      }
    },
    // Scrimba interactive tutorials
    {
      match: (url) => url.includes('scrimba.com'),
      getEmbedUrl: (url) => {
        if (url.includes('/embed/')) return url;
        // Convert to embed format
        const match = url.match(/scrimba\.com\/(?:learn\/)?([^\/\?]+)/);
        return match ? `https://scrimba.com/embed/${match[1]}` : null;
      }
    },
    // StackBlitz
    {
      match: (url) => url.includes('stackblitz.com'),
      getEmbedUrl: (url) => {
        if (url.includes('/embed/')) return url;
        return url.replace('stackblitz.com/', 'stackblitz.com/edit/');
      }
    },
    // JSFiddle
    {
      match: (url) => url.includes('jsfiddle.net'),
      getEmbedUrl: (url) => {
        if (url.includes('/embedded/')) return url;
        return `${url}/embedded/result,html,css,js/`;
      }
    }
  ];

  const getEmbeddableUrl = (url: string) => {
    if (!url || typeof url !== 'string') return { url, canEmbed: false };
    try {
      for (const p of PROVIDERS) {
        if (p.match(url)) {
          const embed = p.getEmbedUrl(url);
          if (embed) return { url: embed, canEmbed: true };
        }
      }
      return { url, canEmbed: false };
    } catch (e) {
      console.error('Error parsing URL:', e);
      return { url, canEmbed: false };
    }
  };

  // -------------------------
  // EmbeddableFrame component - Memoized to prevent flickering
  // -------------------------
  const EmbeddableFrame = useMemo(() => {
    return function FrameComponent({ src, title, fallbackUrl, key }: { src: string; title?: string; fallbackUrl: string; key?: string }) {
      const [loadingFrame, setLoadingFrame] = useState(true);
      const [failed, setFailed] = useState(false);
      const frameRef = useRef<HTMLIFrameElement | null>(null);

      useEffect(() => {
        setLoadingFrame(true);
        setFailed(false);
        return () => {
          setLoadingFrame(false);
          setFailed(false);
        };
      }, [src]);

      return (
        <div style={{ flexGrow: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {loadingFrame && !failed && (
            <div className="d-flex align-items-center justify-content-center m-3">
              <Spinner animation="border" />
              <span className="ms-2">Loading content...</span>
            </div>
          )}

          {failed ? (
            <Alert variant="warning" className="m-3">
              <Alert.Heading>Cannot Embed This Content</Alert.Heading>
              <p className="mb-2">This website blocked iframe embedding. Open in a new tab instead.</p>
              <Button variant="primary" size="sm" onClick={() => window.open(fallbackUrl, '_blank')}>
                <FaExternalLinkAlt className="me-2" /> Open in New Tab
              </Button>
            </Alert>
          ) : (
            <iframe
              key={src}
              ref={frameRef}
              src={src}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                flexGrow: 1
              }}
              title={title || 'Embedded resource'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              onLoad={() => {
                setLoadingFrame(false);
                setFailed(false);
              }}
              onError={() => {
                console.warn('Iframe onError fired for', src);
                setLoadingFrame(false);
                setFailed(true);
              }}
            />
          )}
        </div>
      );
    };
  }, []);

  if (loading || loadingRoadmap) {
    return (
      <>
        <Header />
        <div className="loading-screen">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (error || !roadmap) {
    return (
      <>
        <Header />
        <Container className="py-5">
          <Alert variant="danger">{error || 'Roadmap not found'}</Alert>
          <Button onClick={() => router.push('/roadmap')}>Back to Roadmaps</Button>
        </Container>
      </>
    );
  }

  const completedModules = (roadmap.modules || []).filter(m => m.is_completed).length;
  const totalModules = (roadmap.modules || []).length;

  return (
    <>
      <Header />
      <Container fluid className="py-3">
        {/* Split-screen layout when resource is opened */}
        {openedResource ? (
          <Row className="g-0" style={{ height: 'calc(100vh - 100px)' }}>
            {/* Left side - Module list */}
            <Col md={4} className="border-end" style={{ height: '100%', overflowY: 'auto' }}>
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Learning Path</h5>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => {
                      setOpenedResource(null);
                      if (timeIntervalRef.current) {
                        clearInterval(timeIntervalRef.current);
                      }
                      setActiveResource(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
                
                {/* Current resource info */}
                {openedResource.title && (
                  <Alert variant="primary" className="py-2">
                    <strong>Currently Learning:</strong><br/>
                    {openedResource.title}
                  </Alert>
                )}
                
                {/* Modules accordion - simplified for split view */}
                <Accordion activeKey={activeAccordionKey} onSelect={(key) => setActiveAccordionKey(key as string)}>
                  {(roadmap.modules || []).map((module, index) => (
                    <Accordion.Item key={module.id} eventKey={String(index)}>
                      <Accordion.Header>
                        <small><strong>Module {index + 1}</strong>: {module.title}</small>
                      </Accordion.Header>
                      <Accordion.Body className="p-2">
                        {(module.resources || []).map((resource, rIndex) => {
                          const isActive = openedResource.resourceId === resource.id;
                          const resourceKey = `${module.id}-${resource.id}`;
                          const currentTimeSpent = timeSpent[resourceKey] || 0;
                          const estimatedSeconds = resource.estimated_hours * 3600;
                          const timeProgress = estimatedSeconds > 0 ? (currentTimeSpent / estimatedSeconds) * 100 : 0;
                          
                          // Check if resource is locked (same logic as main view)
                          const resources = module.resources || [];
                          const isResourceLocked = rIndex > 0 && resources[rIndex - 1].status !== 'completed' && resources[rIndex - 1].status !== 'skipped';
                          
                          return (
                            <div 
                              key={resource.id} 
                              className={`p-2 mb-2 rounded ${isActive ? 'bg-primary text-white' : 'bg-light'} ${isResourceLocked ? 'opacity-50' : ''}`}
                              style={{ cursor: isResourceLocked ? 'not-allowed' : 'pointer' }}
                              onClick={() => {
                                if (!isResourceLocked) {
                                  handleOpenResource(module.id, resource.id, resource.url);
                                }
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start">
                                <small className="flex-grow-1">
                                  <strong>{resource.title}</strong>
                                  {resource.status === 'completed' && ' ✓'}
                                  {resource.status === 'skipped' && ' ⏭️'}
                                </small>
                              </div>
                              {isActive && currentTimeSpent > 0 && (
                                <small>
                                  <ProgressBar 
                                    now={timeProgress} 
                                    className="mt-1" 
                                    style={{ height: '4px' }}
                                  />
                                  <div className="mt-1">{formatTime(currentTimeSpent)} / {resource.estimated_hours}h ({Math.round(timeProgress)}%)</div>
                                </small>
                              )}
                            </div>
                          );
                        })}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Col>
            
            {/* Right side - Embedded content */}
            <Col md={8} className="p-0 d-flex flex-column" style={{ height: '100%' }}>
              {/* Action bar */}
              <div className="bg-light border-bottom p-2 d-flex gap-2 justify-content-between align-items-center">
                <div className="d-flex gap-2 align-items-center">
                  <small className="text-muted">
                    {(() => {
                      const resourceKey = `${openedResource.moduleId}-${openedResource.resourceId}`;
                      const currentTimeSpent = timeSpent[resourceKey] || 0;
                      let estimatedSeconds = 0;
                      let timeProgress = 0;
                      
                      // Find resource to get estimated time
                      for (const mod of roadmap.modules) {
                        if (mod.id === openedResource.moduleId) {
                          for (const res of mod.resources) {
                            if (res.id === openedResource.resourceId) {
                              estimatedSeconds = res.estimated_hours * 3600;
                              timeProgress = estimatedSeconds > 0 ? (currentTimeSpent / estimatedSeconds) * 100 : 0;
                              break;
                            }
                          }
                        }
                      }
                      
                      return currentTimeSpent > 0 ? (
                        <>
                          <FaClock className="me-1" />
                          {formatTime(currentTimeSpent)} ({Math.round(timeProgress)}%)
                        </>
                      ) : 'Timer starting...';
                    })()}
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={(e) => {
                      handleCompleteResource(openedResource.moduleId, openedResource.resourceId, e);
                    }}
                    disabled={(() => {
                      const resourceKey = `${openedResource.moduleId}-${openedResource.resourceId}`;
                      const currentTimeSpent = timeSpent[resourceKey] || 0;
                      let estimatedSeconds = 0;
                      for (const mod of roadmap.modules) {
                        if (mod.id === openedResource.moduleId) {
                          for (const res of mod.resources) {
                            if (res.id === openedResource.resourceId) {
                              estimatedSeconds = res.estimated_hours * 3600;
                            }
                          }
                        }
                      }
                      const timeProgress = estimatedSeconds > 0 ? (currentTimeSpent / estimatedSeconds) * 100 : 0;
                      return timeProgress < 90;
                    })()}
                    title={(() => {
                      const resourceKey = `${openedResource.moduleId}-${openedResource.resourceId}`;
                      const currentTimeSpent = timeSpent[resourceKey] || 0;
                      let estimatedSeconds = 0;
                      for (const mod of roadmap.modules) {
                        if (mod.id === openedResource.moduleId) {
                          for (const res of mod.resources) {
                            if (res.id === openedResource.resourceId) {
                              estimatedSeconds = res.estimated_hours * 3600;
                            }
                          }
                        }
                      }
                      const timeProgress = estimatedSeconds > 0 ? (currentTimeSpent / estimatedSeconds) * 100 : 0;
                      return timeProgress < 90 ? `${Math.round(timeProgress)}% - need 90% to complete` : 'Mark as complete';
                    })()}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('[SPLIT-SCREEN SKIP] Button clicked');
                      console.log('[SPLIT-SCREEN SKIP] openedResource state:', openedResource);
                      console.log('[SPLIT-SCREEN SKIP] Calling handleSkipResource with:', {
                        moduleId: openedResource.moduleId,
                        resourceId: openedResource.resourceId,
                        title: openedResource.title
                      });
                      handleSkipResource(openedResource.moduleId, openedResource.resourceId, e);
                    }}
                  >
                    Skip
                  </Button>
                </div>
              </div>
              
              {/* Embedded iframe or fallback */}
              {(() => {
                const embeddableInfo = getEmbeddableUrl(openedResource.url);
                
                if (embeddableInfo.canEmbed) {
                  return (
                    <EmbeddableFrame
                      src={embeddableInfo.url}
                      title={openedResource.title}
                      fallbackUrl={openedResource.url}
                    />
                  );
                }
                
                return (
                  <Alert variant="warning" className="m-3">
                    <Alert.Heading>Cannot Embed This Content</Alert.Heading>
                    <p className="mb-2">
                      This website doesn't allow embedding. Choose an option below:
                    </p>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => window.open(openedResource.url, '_blank')}
                      >
                        <FaExternalLinkAlt className="me-2" />
                        Open in New Tab
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          // Open in reader mode using a simple iframe with different domain
                          const readerUrl = `https://archive.is/newest/${encodeURIComponent(openedResource.url)}`;
                          window.open(readerUrl, '_blank');
                        }}
                        title="View cached/archived version"
                      >
                        📖 Reader Mode
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => {
                          // Copy URL to clipboard
                          navigator.clipboard.writeText(openedResource.url);
                          showSuccess('URL copied to clipboard!');
                        }}
                      >
                        📋 Copy URL
                      </Button>
                    </div>
                    <p className="mt-3 mb-0 small text-muted">
                      💡 Tip: Once you've reviewed the content in the new tab, come back here and the timer will still be running!
                    </p>
                  </Alert>
                );
              })()}
            </Col>
          </Row>
        ) : (
          /* Normal view when no resource is opened */
          <div>
            {/* Header */}
            <Row className="mb-4">
              <Col>
                <Button variant="outline-secondary" onClick={() => router.push('/roadmap')} className="mb-3">
                  ← Back to Roadmaps
                </Button>
                <h1>{roadmap.target_role} Learning Path</h1>
                <p className="text-muted">
                  {(roadmap.skill_gaps || []).length} skills to master • {roadmap.total_estimated_hours} hours
                </p>
              </Col>
            </Row>

        {/* Progress Overview */}
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Overall Progress</h5>
            <ProgressBar 
              now={roadmap.progress_percentage} 
              label={`${Math.round(roadmap.progress_percentage)}%`}
              className="mb-3"
              style={{ height: '30px' }}
            />
            <div className="d-flex justify-content-between text-muted">
              <span>{completedModules} of {totalModules} modules completed</span>
              <span>Current: Module {roadmap.current_module_index + 1}</span>
            </div>
          </Card.Body>
        </Card>

        {/* Skills to Learn */}
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Skills You'll Master</h5>
            <div className="d-flex flex-wrap gap-2">
              {(roadmap.skill_gaps || []).map((gap: any, index) => (
                <Badge key={index} bg="primary" className="p-2">
                  {typeof gap === 'string' ? gap : gap.skill}
                </Badge>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Learning Modules */}
        <h4 className="mb-3">Learning Modules</h4>
        <Accordion 
          activeKey={activeAccordionKey} 
          onSelect={(key) => setActiveAccordionKey(key as string)}
        >
          {(roadmap.modules || []).map((module, index) => {
            const isLocked = index > roadmap.current_module_index;
            const completedResources = (module.resources || []).filter(r => r.status === 'completed' || r.status === 'skipped').length;
            const totalResources = (module.resources || []).length;
            const moduleProgress = totalResources > 0 ? (completedResources / totalResources) * 100 : 0;
            const weekNumber = module.week_number || Math.floor(index / 2) + 1;

            return (
              <Accordion.Item key={module.id} eventKey={String(index)}>
                <Accordion.Header>
                  <div className="d-flex align-items-center justify-content-between w-100 me-3">
                    <div className="d-flex align-items-center">
                      {module.is_completed ? (
                        <FaCheckCircle className="text-success me-2" />
                      ) : isLocked ? (
                        <FaLock className="text-muted me-2" />
                      ) : (
                        <FaPlay className="text-primary me-2" />
                      )}
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <strong>Module {index + 1}: {module.title}</strong>
                          <Badge bg="secondary" pill>Week {weekNumber}</Badge>
                        </div>
                        <div className="text-muted small">
                          {completedResources}/{totalResources} resources • {module.estimated_total_hours}h
                        </div>
                      </div>
                    </div>
                    {!isLocked && (
                      <ProgressBar 
                        now={moduleProgress} 
                        style={{ width: '100px', height: '8px' }}
                        className="ms-auto"
                      />
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <p className="text-muted mb-3">{module.description}</p>
                  
                  <h6>Skills Covered:</h6>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {(module.skills_covered || []).map((skill, i) => (
                      <Badge key={i} bg="info">{skill}</Badge>
                    ))}
                  </div>

                  <h6>Learning Resources:</h6>
                  {(module.resources || []).map((resource, rIndex) => {
                    const resources = module.resources || [];
                    const isResourceLocked = isLocked || (rIndex > 0 && resources[rIndex - 1].status !== 'completed' && resources[rIndex - 1].status !== 'skipped');
                    const isCompleted = resource.status === 'completed';
                    const isSkipped = resource.status === 'skipped';
                    const isInProgress = resource.status === 'in_progress';
                    
                    const resourceKey = `${module.id}-${resource.id}`;
                    const currentTimeSpent = timeSpent[resourceKey] || 0;
                    const estimatedSeconds = resource.estimated_hours * 3600;
                    const timeProgress = estimatedSeconds > 0 ? (currentTimeSpent / estimatedSeconds) * 100 : 0;

                    return (
                      <Card 
                        key={resource.id} 
                        className={`mb-2 ${isResourceLocked ? 'opacity-50' : ''} ${isInProgress ? 'border-primary' : ''}`}
                      >
                        <Card.Body className="p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                {isCompleted ? (
                                  <FaCheckCircle className="text-success me-2" />
                                ) : isSkipped ? (
                                  <FaForward className="text-warning me-2" />
                                ) : isResourceLocked ? (
                                  <FaLock className="text-muted me-2" />
                                ) : isInProgress ? (
                                  <FaPlay className="text-primary me-2" />
                                ) : (
                                  <FaBook className="text-primary me-2" />
                                )}
                                <strong>{resource.title}</strong>
                                <Badge bg="secondary" className="ms-2">{resource.resource_type}</Badge>
                                {isSkipped && <Badge bg="warning" className="ms-2">Skipped</Badge>}
                              </div>
                              <p className="text-muted small mb-2">{resource.description}</p>
                              <div className="d-flex align-items-center gap-3 text-muted small">
                                <div className="d-flex align-items-center">
                                  <FaClock className="me-1" />
                                  {resource.estimated_hours}h estimated
                                </div>
                                {(resource.rating || 0) > 0 && (
                                  <div className="d-flex align-items-center">
                                    <StarRating 
                                      rating={resource.rating || 0} 
                                      size="sm" 
                                      showCount 
                                      ratingCount={resource.rating_count || 0}
                                    />
                                  </div>
                                )}
                                {(isInProgress || isCompleted) && currentTimeSpent > 0 && (
                                  <div className="text-primary">
                                    Time spent: {formatTime(currentTimeSpent)} ({Math.round(timeProgress)}%)
                                  </div>
                                )}
                              </div>
                              {isInProgress && timeProgress < 90 && (
                                <ProgressBar 
                                  now={timeProgress} 
                                  label={`${Math.round(timeProgress)}%`}
                                  className="mt-2"
                                  style={{ height: '20px' }}
                                  variant={timeProgress >= 90 ? 'success' : 'info'}
                                />
                              )}
                            </div>
                            <div className="d-flex flex-column gap-2">
                              <Button
                                variant={isInProgress ? "primary" : "outline-primary"}
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleOpenResource(module.id, resource.id, resource.url);
                                }}
                                disabled={isResourceLocked}
                              >
                                <FaExternalLinkAlt className="me-1" />
                                {isInProgress ? 'Continue' : isCompleted || isSkipped ? 'Re-open' : 'Open'}
                              </Button>
                              {!isCompleted && !isSkipped && !isResourceLocked && (
                                <>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('[BTN CLICK] Complete button clicked for:', { 
                                        moduleId: module.id, 
                                        resourceId: resource.id,
                                        moduleTitle: module.title,
                                        resourceTitle: resource.title,
                                        timeProgress 
                                      });
                                      handleCompleteResource(module.id, resource.id, e);
                                    }}
                                    disabled={timeProgress < 90}
                                    title={timeProgress < 90 ? `Complete ${Math.round(timeProgress)}% to unlock (90% required)` : 'Mark as complete'}
                                  >
                                    Mark Complete {timeProgress < 90 && `(${Math.round(timeProgress)}%)`}
                                  </Button>
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log('[BTN CLICK] Skip button clicked for:', { 
                                        moduleId: module.id, 
                                        resourceId: resource.id,
                                        moduleTitle: module.title,
                                        resourceTitle: resource.title 
                                      });
                                      handleSkipResource(module.id, resource.id, e);
                                    }}
                                    title="Skip if you already know this"
                                  >
                                    <FaForward className="me-1" />
                                    Skip
                                  </Button>
                                </>
                              )}
                              {isCompleted && (
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleRateResource(resource)}
                                >
                                  <FaStar className="me-1" />
                                  Rate
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
        
        {/* Module Completion Summary Modal */}
        <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} size="lg">
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>🎉 Module Completed!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {moduleSummaries.map((summary, idx) => (
              <div key={idx} className="mb-4">
                <h5 className="text-primary mb-3">{summary.module_title}</h5>
                <p className="lead" style={{ whiteSpace: 'pre-line' }}>
                  {summary.summary}
                </p>
                {idx < moduleSummaries.length - 1 && <hr />}
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
              Continue Learning
            </Button>
          </Modal.Footer>
        </Modal>
          </div>
        )}
        
        {/* Module Summary Modal - shown in both views */}
        <Modal show={showSummaryModal} onHide={() => setShowSummaryModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>🎉 Module Complete!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {moduleSummaries.map((summary, idx) => (
              <div key={idx} className="mb-4">
                <h5 className="text-primary mb-3">{summary.module_title}</h5>
                <p className="lead" style={{ whiteSpace: 'pre-line' }}>
                  {summary.summary}
                </p>
                {idx < moduleSummaries.length - 1 && <hr />}
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
              Continue Learning
            </Button>
          </Modal.Footer>
        </Modal>
        
        {/* Resource Rating Modal - shown in both views */}
        <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FaStar className="me-2 text-warning" />
              Rate Resource
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {ratingResource && (
              <>
                <h5 className="mb-3">{ratingResource.title}</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Your Rating</Form.Label>
                  <div className="mb-2">
                    <StarRating 
                      rating={userRating} 
                      interactive 
                      onRate={setUserRating}
                      size="lg"
                    />
                  </div>
                  {userRating > 0 && (
                    <Form.Text className="text-muted">
                      {userRating === 5 ? 'Excellent!' : userRating === 4 ? 'Very Good' : userRating === 3 ? 'Good' : userRating === 2 ? 'Fair' : 'Needs Improvement'}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Share your thoughts about this resource..."
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRatingModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={submitRating}
              disabled={userRating === 0 || submittingRating}
            >
              {submittingRating ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : (
                'Submit Rating'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
