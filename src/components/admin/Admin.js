import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit2, KeyRound, Settings, LayoutGrid, CheckCircle, Users, Mail, MessageSquare, Video, Upload, AppWindow } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAdminStore, useLangStore } from '../../lib/store';
import { playHover, playClick, playSuccess, playFail } from '../../lib/sfx';
import { fetchCollaborators } from '../../lib/api';
import gamesData from '../../data/games.json';
import RetroCard from '../ui/RetroCard';
import RetroInput from '../ui/RetroInput';
import RetroButton from '../ui/RetroButton';

export default function Admin() {
  const { lang } = useLangStore();

  // Store variables
  const {
    unlocked,
    githubOwner,
    githubRepo,
    githubBranch,
    githubPath,
    githubToken,
    setUnlocked,
    setGithubConfig,
    logout
  } = useAdminStore();

  // Local state
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('games'); // 'games', 'collaborators', 'config'
  const [games, setGames] = useState(gamesData);
  const [collaborators, setCollaborators] = useState([]);
  const [pinError, setPinError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [loadingCollabs, setLoadingCollabs] = useState(false);
  const [tokenRevealed, setTokenRevealed] = useState(false);

  // Form states for new game
  const [newGame, setNewGame] = useState({
    id: '',
    titleEn: '',
    titleId: '',
    titleJp: '',
    descEn: '',
    descId: '',
    descJp: '',
    price: 0,
    genre: '',
    rating: 5,
    releaseYear: new Date().getFullYear(),
    image: '',
    featured: false,
    playUrl: '',
    videoUrl: '',
    platform: '',
    type: 'game'
  });

  const [editingGameId, setEditingGameId] = useState(null);

  // Selected Image File for upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Selected Video File for upload
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');

  const [selectedPlatforms, setSelectedPlatforms] = useState({
    PC: false,
    Console: false,
    Android: false,
    iOS: false,
    Roblox: false,
    Windows: false,
    Linux: false,
    Mac: false,
    Webapps: false
  });

  // Github form configs
  const [gitConfig, setGitConfig] = useState({
    owner: githubOwner || 'itsmebroarif',
    repo: githubRepo || 'sukamaju',
    branch: githubBranch || 'main',
    path: githubPath || 'src/data/games.json',
    token: githubToken || ''
  });

  // Sync state with store once store values load
  useEffect(() => {
    setGitConfig({
      owner: githubOwner || 'itsmebroarif',
      repo: githubRepo || 'sukamaju',
      branch: githubBranch || 'main',
      path: githubPath || 'src/data/games.json',
      token: githubToken || ''
    });
  }, [githubOwner, githubRepo, githubBranch, githubPath, githubToken]);

  // Load collaborators from Sheets API on mount / unlock
  useEffect(() => {
    if (unlocked) {
      loadCollaboratorsData();
    }
  }, [unlocked]);

  const loadCollaboratorsData = async () => {
    setLoadingCollabs(true);
    try {
      const data = await fetchCollaborators();
      setCollaborators(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCollabs(false);
    }
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    playClick();
    if (pin === '181203') {
      playSuccess();
      setUnlocked(true);
      setPinError('');
    } else {
      playFail();
      setPinError(lang === 'id' ? 'PIN SALAH! AKSES DITOLAK.' : lang === 'jp' ? 'PINが正しくありません！' : 'INVALID PIN! ACCESS DENIED.');
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    playClick();
    setGithubConfig({
      githubOwner: gitConfig.owner,
      githubRepo: gitConfig.repo,
      githubBranch: gitConfig.branch,
      githubPath: gitConfig.path,
      githubToken: gitConfig.token
    });
    playSuccess();
    Swal.fire({
      toast: true,
      position: 'top-end',
      title: 'Config Saved!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500,
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-2 border-slate-950 font-press text-[9px] uppercase rounded-none'
      }
    });
  };

  const handleRevealToken = () => {
    playClick();
    Swal.fire({
      title: 'SECURITY CHALLENGE',
      text: 'Enter Secure PIN to reveal GitHub Personal Access Token:',
      input: 'password',
      inputPlaceholder: 'ENTER PIN',
      showCancelButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#e11d48',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        input: 'border-2 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-mono text-center rounded-none',
        confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
        cancelButton: 'font-press text-[9px] uppercase px-4 py-2 bg-rose-600 border-2 border-slate-950 shadow-retro-sm rounded-none'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value === '181203') {
          playSuccess();
          setTokenRevealed(true);
        } else {
          playFail();
          Swal.fire({
            icon: 'error',
            title: 'ACCESS DENIED',
            text: 'INVALID PIN CODE.',
            background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
            customClass: {
              popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
            }
          });
        }
      }
    });
  };

  // Image Selection Handler
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      playClick();
      setImageFile(file);
      setImageFileName(file.name);

      // Auto-set the preview path
      setNewGame(prev => ({
        ...prev,
        image: `/images/games/${file.name}`
      }));
    }
  };

  // Video Selection Handler
  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 200MB size limit check
      const maxSize = 200 * 1024 * 1024;
      if (file.size > maxSize) {
        playFail();
        Swal.fire({
          title: 'File Too Large',
          text: `Video file size exceeds the 200MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
          icon: 'error',
          confirmButtonColor: '#e11d48',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
          customClass: {
            popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
          }
        });
        e.target.value = null; // reset input
        return;
      }

      playClick();
      setVideoFile(file);
      setVideoFileName(file.name);

      // Auto-set the preview path
      setNewGame(prev => ({
        ...prev,
        videoUrl: `/videos/games/${file.name}`
      }));
    }
  };

  const handleSaveGame = (e) => {
    e.preventDefault();
    playClick();

    if (!newGame.titleEn || !newGame.descEn) {
      playFail();
      Swal.fire({
        title: 'Error',
        text: 'Title (EN) and Description (EN) are required.',
        icon: 'error',
        confirmButtonColor: '#9333ea',
      });
      return;
    }

    if (!newGame.image) {
      playFail();
      Swal.fire({
        title: 'Error',
        text: 'Please select an image file to upload or enter a URL path.',
        icon: 'error',
        confirmButtonColor: '#9333ea',
      });
      return;
    }

    const gamePlatformsList = ['PC', 'Console', 'Android', 'iOS', 'Roblox'];
    const appPlatformsList = ['Windows', 'Linux', 'Mac', 'Android', 'iOS', 'Webapps'];
    const activePlatforms = newGame.type === 'app' ? appPlatformsList : gamePlatformsList;

    const platformString = Object.keys(selectedPlatforms)
      .filter(key => activePlatforms.includes(key) && selectedPlatforms[key])
      .join(' / ');

    if (editingGameId) {
      // Edit mode: Update existing game in the list
      const updatedGames = games.map((game) => {
        if (game.id === editingGameId) {
          return {
            ...game,
            title: {
              en: newGame.titleEn,
              id: newGame.titleId || newGame.titleEn,
              jp: newGame.titleJp || newGame.titleEn
            },
            description: {
              en: newGame.descEn,
              id: newGame.descId || newGame.descEn,
              jp: newGame.descJp || newGame.descEn
            },
            price: Number(newGame.price) || 0,
            genre: newGame.genre,
            rating: Number(newGame.rating) || 4.5,
            releaseYear: Number(newGame.releaseYear) || new Date().getFullYear(),
            image: newGame.image,
            featured: newGame.featured,
            playUrl: newGame.playUrl,
            videoUrl: newGame.videoUrl || '',
            platform: platformString,
            type: newGame.type || 'game',
            // If new image/video was uploaded, preserve for upload step
            ...(imageFile ? { _file: imageFile, _fileName: imageFileName } : {}),
            ...(videoFile ? { _videoFile: videoFile, _videoFileName: videoFileName } : {})
          };
        }
        return game;
      });

      setGames(updatedGames);
      setEditingGameId(null);
      playSuccess();
      Swal.fire({
        title: 'Success',
        text: 'Record updated locally. Don\'t forget to click "COMMIT & PUSH TO GITHUB" to save changes permanently.',
        icon: 'success',
        confirmButtonColor: '#9333ea',
      });
    } else {
      // Add mode: Create new game record
      const gameId = `game-${Date.now()}`;
      const gameToAdd = {
        id: gameId,
        title: {
          en: newGame.titleEn,
          id: newGame.titleId || newGame.titleEn,
          jp: newGame.titleJp || newGame.titleEn
        },
        description: {
          en: newGame.descEn,
          id: newGame.descId || newGame.descEn,
          jp: newGame.descJp || newGame.descEn
        },
        price: Number(newGame.price) || 0,
        genre: newGame.genre,
        rating: Number(newGame.rating) || 4.5,
        releaseYear: Number(newGame.releaseYear) || new Date().getFullYear(),
        image: newGame.image,
        featured: newGame.featured,
        playUrl: newGame.playUrl,
        videoUrl: newGame.videoUrl || '',
        platform: platformString,
        type: newGame.type || 'game',
        _file: imageFile,
        _fileName: imageFileName,
        _videoFile: videoFile,
        _videoFileName: videoFileName
      };

      setGames([...games, gameToAdd]);
      playSuccess();
    }

    // Reset Form & File Selection
    resetForm(activeTab === 'apps' ? 'app' : 'game');
  };

  const resetForm = (typeDefault = 'game') => {
    setNewGame({
      id: '',
      titleEn: '',
      titleId: '',
      titleJp: '',
      descEn: '',
      descId: '',
      descJp: '',
      price: 0,
      genre: 'SaaS / Utility',
      rating: 5.0,
      releaseYear: new Date().getFullYear(),
      image: '',
      featured: false,
      playUrl: '',
      videoUrl: '',
      platform: '',
      type: typeDefault
    });
    setEditingGameId(null);
    setImageFile(null);
    setImageFileName('');
    setVideoFile(null);
    setVideoFileName('');
    setSelectedPlatforms({
      PC: false,
      Console: false,
      Android: false,
      iOS: false,
      Roblox: false,
      Windows: false,
      Linux: false,
      Mac: false,
      Webapps: false
    });
  };

  const handleEditGame = (game) => {
    playClick();
    setEditingGameId(game.id);
    setNewGame({
      id: game.id,
      titleEn: game.title.en,
      titleId: game.title.id || '',
      titleJp: game.title.jp || '',
      descEn: game.description.en,
      descId: game.description.id || '',
      descJp: game.description.jp || '',
      price: game.price || 0,
      genre: game.genre || '',
      rating: game.rating || 5,
      releaseYear: game.releaseYear || new Date().getFullYear(),
      image: game.image || '',
      featured: game.featured || false,
      playUrl: game.playUrl || '',
      videoUrl: game.videoUrl || '',
      platform: game.platform || '',
      type: game.type || 'game'
    });

    const platforms = game.platform ? game.platform.split(/\s*[/,]\s*/) : [];
    setSelectedPlatforms({
      PC: platforms.includes('PC'),
      Console: platforms.includes('Console'),
      Android: platforms.includes('Android'),
      iOS: platforms.includes('iOS'),
      Roblox: platforms.includes('Roblox'),
      Windows: platforms.includes('Windows'),
      Linux: platforms.includes('Linux'),
      Mac: platforms.includes('Mac'),
      Webapps: platforms.includes('Webapps') || platforms.includes('Web App') || platforms.includes('Webapps')
    });

    setImageFile(null);
    setImageFileName('');
    setVideoFile(null);
    setVideoFileName('');

    // Switch to corresponding tab
    if (game.type === 'app') {
      setActiveTab('apps');
    } else {
      setActiveTab('games');
    }
    // Scroll to form smoothly
    const formEl = document.getElementById('game-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    playClick();
    setEditingGameId(null);
    setNewGame({
      id: '',
      titleEn: '',
      titleId: '',
      titleJp: '',
      descEn: '',
      descId: '',
      descJp: '',
      price: 0,
      genre: 'RPG / Adventure',
      rating: 4.5,
      releaseYear: new Date().getFullYear(),
      image: '',
      featured: false,
      playUrl: '',
      videoUrl: '',
      platform: '',
      type: 'game'
    });
    setImageFile(null);
    setImageFileName('');
    setVideoFile(null);
    setVideoFileName('');
    setSelectedPlatforms({
      PC: false,
      Console: false,
      Android: false,
      iOS: false,
      Roblox: false
    });
  };

  const handleDeleteGame = (id) => {
    playClick();
    Swal.fire({
      title: 'Delete this game?',
      text: 'This will remove it from the list. You must commit to push changes to GitHub.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#475569',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-rose-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setGames(games.filter((g) => g.id !== id));
        playSuccess();
      }
    });
  };

  // Convert File to Base64 Helper
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Strip the data:image/*;base64, prefix
        const base64Str = reader.result.split(',')[1];
        resolve(base64Str);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePushToGithub = async () => {
    playClick();

    if (!githubOwner || !githubRepo || !githubToken) {
      playFail();
      Swal.fire({
        title: 'Missing Configurations',
        text: 'Please configure your GitHub credentials in the CONFIG tab first.',
        icon: 'error',
        confirmButtonColor: '#e11d48',
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
        customClass: {
          popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        }
      });
      return;
    }

    setIsSyncing(true);

    try {
      // 1. Upload local images to GitHub first (if any are pending)
      const gamesToUpload = games.filter(g => g._file);
      for (const game of gamesToUpload) {
        const fileContentBase64 = await fileToBase64(game._file);
        const imagePath = `public/images/games/${game._fileName}`;
        const imageApiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${imagePath}`;

        // Check if image already exists to get SHA
        const checkRes = await fetch(imageApiUrl + `?ref=${githubBranch}`, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });

        let imageSha = '';
        if (checkRes.ok) {
          const imgInfo = await checkRes.json();
          imageSha = imgInfo.sha;
        }

        // Commit image to GitHub
        const imgBody = {
          message: `media: upload game thumbnail ${game._fileName} via Admin Panel`,
          content: fileContentBase64,
          branch: githubBranch
        };
        if (imageSha) imgBody.sha = imageSha;

        const imgPutRes = await fetch(imageApiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imgBody)
        });

        if (!imgPutRes.ok) {
          throw new Error(`Failed to upload image ${game._fileName} to GitHub. Status: ${imgPutRes.status}`);
        }
      }

      // 1.5 Upload local videos to GitHub (if any are pending)
      const videosToUpload = games.filter(g => g._videoFile);
      for (const game of videosToUpload) {
        const fileContentBase64 = await fileToBase64(game._videoFile);
        const videoPath = `public/videos/games/${game._videoFileName}`;
        const videoApiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${videoPath}`;

        // Check if video already exists to get SHA
        const checkRes = await fetch(videoApiUrl + `?ref=${githubBranch}`, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });

        let videoSha = '';
        if (checkRes.ok) {
          const videoInfo = await checkRes.json();
          videoSha = videoInfo.sha;
        }

        // Commit video to GitHub
        const videoBody = {
          message: `media: upload game trailer ${game._videoFileName} via Admin Panel`,
          content: fileContentBase64,
          branch: githubBranch
        };
        if (videoSha) videoBody.sha = videoSha;

        const videoPutRes = await fetch(videoApiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(videoBody)
        });

        if (!videoPutRes.ok) {
          throw new Error(`Failed to upload video ${game._videoFileName} to GitHub. Status: ${videoPutRes.status}`);
        }
      }

      // 2. Clear temp file attachments from JSON list
      const gamesClean = games.map(g => {
        const clean = { ...g };
        delete clean._file;
        delete clean._fileName;
        delete clean._videoFile;
        delete clean._videoFileName;
        return clean;
      });

      // 3. Fetch games.json file content to get current SHA
      const getUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}?ref=${githubBranch}`;
      const getRes = await fetch(getUrl, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });

      let sha = '';
      if (getRes.ok) {
        const fileInfo = await getRes.json();
        sha = fileInfo.sha;
      } else if (getRes.status !== 404) {
        throw new Error(`Failed to fetch file SHA from GitHub. Status: ${getRes.status}`);
      }

      // 4. Prepare JSON payload and base64 encoding (supporting Unicode characters)
      const gamesJsonString = JSON.stringify(gamesClean, null, 2);
      const utf8Bytes = new TextEncoder().encode(gamesJsonString);
      let binaryString = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
      }
      const base64Content = window.btoa(binaryString);

      // 5. Commit json back to GitHub
      const putUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${githubPath}`;
      const body = {
        message: 'feat: update games.json database via Sukamaju Hub Admin Panel',
        content: base64Content,
        branch: githubBranch
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!putRes.ok) {
        const errDetail = await putRes.text();
        throw new Error(`GitHub Commit failed: ${putRes.status} - ${errDetail}`);
      }

      playSuccess();

      // Update local state to show uploads are done
      setGames(gamesClean);

      Swal.fire({
        title: 'Commit Successful!',
        text: 'Images and games database pushed to GitHub successfully. Vercel will trigger a new build in a moment.',
        icon: 'success',
        confirmButtonColor: '#9333ea',
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
        customClass: {
          popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
          confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
        }
      });

    } catch (err) {
      playFail();
      console.error(err);
      Swal.fire({
        title: 'Sync Failed',
        text: err.message || 'Unable to update GitHub repository content.',
        icon: 'error',
        confirmButtonColor: '#e11d48',
        background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
        customClass: {
          popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        }
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Meet Invitation drafter
  const handleScheduleMeet = (name, idea) => {
    playClick();

    Swal.fire({
      title: 'Schedule Google Meet',
      text: 'Propose a meeting date and time. This will generate an invitation message and open Google Meet to start a room.',
      html: `
        <div class="flex flex-col gap-3 text-left font-inter text-sm mt-3">
          <label class="font-bold">Meeting Agenda</label>
          <input id="meet-agenda" class="swal2-input m-0 w-full border-2 border-slate-950" value="Discussion: ${idea.substring(0, 30)}..." />
          
          <label class="font-bold mt-2">Date & Time</label>
          <input id="meet-time" type="datetime-local" class="swal2-input m-0 w-full border-2 border-slate-950" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Meet & Invite',
      confirmButtonColor: '#9333ea',
      cancelButtonColor: '#475569',
      background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
      customClass: {
        popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
        confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-purple-650 border-2 border-slate-950 shadow-retro-sm rounded-none',
      },
      preConfirm: () => {
        const agenda = document.getElementById('meet-agenda').value;
        const time = document.getElementById('meet-time').value;
        if (!time) {
          Swal.showValidationMessage('Meeting Date & Time is required!');
          return false;
        }
        return { agenda, time };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        playSuccess();
        const { agenda, time } = result.value;
        const formattedTime = new Date(time).toLocaleString();

        // Draft invitation message
        let inviteMsg = `*📅 GOOGLE MEET INVITATION - SUKAMAJU HUB*\n`;
        inviteMsg += `=======================================\n`;
        inviteMsg += `Topic: ${agenda}\n`;
        inviteMsg += `Time: ${formattedTime}\n\n`;
        inviteMsg += `Hi ${name}, let's discuss your collaboration proposal via Google Meet.\n`;
        inviteMsg += `Please join the meeting link below at the scheduled time:\n`;
        inviteMsg += `Link: https://meet.google.com/new\n`;
        inviteMsg += `=======================================\n`;

        // Prompt user to copy invitation message
        Swal.fire({
          title: 'Invitation Drafted!',
          icon: 'success',
          html: `
            <div class="text-left font-mono text-[10px] bg-slate-100 dark:bg-slate-900 border p-3 mt-3 select-all">
              ${inviteMsg.replace(/\n/g, '<br/>')}
            </div>
            <p class="text-xs text-slate-500 mt-3">Copy the text above and send it to the collaborator. Click "Launch Meet" to open a new Google Meet room.</p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Launch Meet Room',
          cancelButtonText: 'Close',
          confirmButtonColor: '#0ea5e9',
          background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
          color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
          customClass: {
            popup: 'border-4 border-slate-950 font-inter text-sm rounded-none',
            confirmButton: 'font-press text-[9px] uppercase px-4 py-2 bg-cyan-600 border-2 border-slate-950 shadow-retro-sm rounded-none',
          }
        }).then((res) => {
          if (res.isConfirmed) {
            window.open('https://meet.google.com/new', '_blank');
          }
        });
      }
    });
  };

  const triggerLogout = () => {
    playClick();
    logout();
  };

  // ================= 1. RENDER LOCK SCREEN =================
  if (!unlocked) {
    return (
      <div className="py-20 px-4 md:px-8 max-w-md mx-auto font-inter transition-colors duration-200">
        <RetroCard
          variant="purple"
          title="ADMINISTRATOR_LOGON"
          className="bg-white dark:bg-slate-950"
        >
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-6 mt-2 text-left">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-2xl bg-[#0071e3] text-white flex items-center justify-center shadow-sm">
                <KeyRound className="w-8 h-8" />
              </div>
            </div>

            <RetroInput
              id="admin-pin"
              type="password"
              label="ENTER PASS-KEY PIN"
              placeholder="******"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              error={pinError}
              required
            />

            <RetroButton
              type="submit"
              variant="purple"
              fullWidth
            >
              UNLOCK CONSOLE
            </RetroButton>
          </form>
        </RetroCard>
      </div>
    );
  }

  // ================= 2. RENDER ADMIN WORKSPACE WITH SIDEBAR =================
  return (
    <div className="py-6 px-4 md:px-8 transition-colors duration-250">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 font-sans">

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-slate-200 dark:border-white/10 bg-slate-900 text-white p-5 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-sm md:text-base font-bold tracking-tight">SUKAMAJU HUB ADMIN WORKSPACE</h1>
              <span className="text-[10px] text-slate-400 font-medium">GitHub Repositories Sync Client v1.1</span>
            </div>
          </div>
          <RetroButton
            variant="gray"
            size="sm"
            onClick={triggerLogout}
            className="mt-3 sm:mt-0"
          >
            LOCK CONSOLE
          </RetroButton>
        </div>

        {/* Sidebar + Workspace layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* Admin Sidebar Navigation Panel */}
          <div className="md:col-span-3 flex flex-col gap-4">

            {/* Sync Summary Widget */}
            <RetroCard variant="cyan" title="GIT_STATUS">
              <div className="flex flex-col gap-3.5 text-left font-mono text-[9px] leading-relaxed">
                <div>&gt; RECORD: {games.length} games loaded</div>
                <div>&gt; REPO: {githubOwner || '?'}/{githubRepo || '?'}</div>
                <div>&gt; PATH: {githubPath}</div>
                <RetroButton
                  variant="green"
                  fullWidth
                  size="sm"
                  onClick={handlePushToGithub}
                  disabled={isSyncing}
                  className="flex items-center justify-center gap-1.5 mt-2"
                >
                  <CheckCircle className="w-4.5 h-4.5" />
                  {isSyncing ? 'SYNCING...' : 'COMMIT TO REPO'}
                </RetroButton>
              </div>
            </RetroCard>

            {/* Sidebar Buttons */}
            <RetroCard variant="default" title="SIDEBAR NAVIGATION">
              <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                <button
                  onClick={() => { playClick(); setActiveTab('games'); resetForm('game'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                    activeTab === 'games' 
                      ? 'bg-[#0071e3] text-white shadow-sm font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Games
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('apps'); resetForm('app'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                    activeTab === 'apps' 
                      ? 'bg-[#0071e3] text-white shadow-sm font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <AppWindow className="w-4 h-4" />
                  Applications
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('collaborators'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                    activeTab === 'collaborators' 
                      ? 'bg-[#0071e3] text-white shadow-sm font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Collaborators
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('config'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                    activeTab === 'config' 
                      ? 'bg-[#0071e3] text-white shadow-sm font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </RetroCard>

          </div>

          {/* Main Panel Content */}
          <div className="md:col-span-9 flex flex-col gap-6">

            {/* T1: GAMES MANAGER TAB */}
            {activeTab === 'games' && (
              <div className="flex flex-col gap-6">

                {/* Form: Add Game Wizard */}
                <RetroCard variant="default" title={editingGameId ? "EDIT GAME RECORD" : "GAME CREATOR WIZARD"} id="game-form">
                  <form 
                    onSubmit={(e) => {
                      newGame.type = 'game';
                      handleSaveGame(e);
                    }} 
                    className="flex flex-col gap-5 text-left"
                  >

                    {/* Multilang Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <RetroInput
                        id="title-en"
                        label="Game Title (English)"
                        value={newGame.titleEn}
                        onChange={(e) => setNewGame({ ...newGame, titleEn: e.target.value })}
                        required
                      />
                      <RetroInput
                        id="title-id"
                        label="Game Title (Indonesian)"
                        value={newGame.titleId}
                        onChange={(e) => setNewGame({ ...newGame, titleId: e.target.value })}
                      />
                      <RetroInput
                        id="title-jp"
                        label="Game Title (Japanese)"
                        value={newGame.titleJp}
                        onChange={(e) => setNewGame({ ...newGame, titleJp: e.target.value })}
                      />
                    </div>

                    {/* Multilang Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <RetroInput
                        id="desc-en"
                        label="Description (English)"
                        value={newGame.descEn}
                        onChange={(e) => setNewGame({ ...newGame, descEn: e.target.value })}
                        required
                      />
                      <RetroInput
                        id="desc-id"
                        label="Description (Indonesian)"
                        value={newGame.descId}
                        onChange={(e) => setNewGame({ ...newGame, descId: e.target.value })}
                      />
                      <RetroInput
                        id="desc-jp"
                        label="Description (Japanese)"
                        value={newGame.descJp}
                        onChange={(e) => setNewGame({ ...newGame, descJp: e.target.value })}
                      />
                    </div>

                    {/* Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <RetroInput
                        id="genre"
                        label="Genre Category"
                        value={newGame.genre}
                        onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                      />
                      <RetroInput
                        id="rating"
                        type="number"
                        label="Rating (1.0-5.0)"
                        value={newGame.rating}
                        onChange={(e) => setNewGame({ ...newGame, rating: e.target.value })}
                      />
                      <RetroInput
                        id="year"
                        type="number"
                        label="Release Year"
                        value={newGame.releaseYear}
                        onChange={(e) => setNewGame({ ...newGame, releaseYear: e.target.value })}
                      />

                      <div className="flex flex-col gap-1.5 justify-center">
                        <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                          Featured Status
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewGame({ ...newGame, featured: !newGame.featured })}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold select-none transition-all active:scale-95 ${
                            newGame.featured 
                              ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm' 
                              : 'bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {newGame.featured ? 'FEATURED' : 'REGULAR'}
                        </button>
                      </div>
                    </div>

                    {/* Game Play/Download URL Input */}
                    <div className="w-full">
                      <RetroInput
                        id="playUrl"
                        label="Game Play / Download URL (Roblox, itch.io, etc.)"
                        value={newGame.playUrl}
                        onChange={(e) => setNewGame({ ...newGame, playUrl: e.target.value })}
                        placeholder="e.g., https://www.roblox.com/games/123456 or https://sukamajuhub.itch.io/game"
                      />
                    </div>

                    {/* Supported Platforms Checkboxes */}
                    <div className="flex flex-col gap-2 w-full text-left">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Supported Platforms (Console, PC, Android, iOS, Roblox)
                      </label>
                      <div className="flex flex-wrap gap-4 border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        {['PC', 'Console', 'Android', 'iOS', 'Roblox'].map((plat) => (
                          <label key={plat} className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-350 font-medium">
                            <input
                              type="checkbox"
                              checked={!!selectedPlatforms[plat]}
                              onChange={() => {
                                playClick();
                                setSelectedPlatforms({
                                  ...selectedPlatforms,
                                  [plat]: !selectedPlatforms[plat]
                                });
                              }}
                              className="w-4 h-4 cursor-pointer accent-[#0071e3]"
                            />
                            <span className="text-xs uppercase text-slate-800 dark:text-slate-200">
                              {plat}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Image File Uploader */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Choose Game Image Thumbnail (Saved in public/images/games/ & pushed to GitHub)
                      </label>
                      <div className="flex gap-2.5 items-center">
                        <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                          <Upload className="w-4 h-4 text-slate-500" />
                          SELECT IMAGE FILE
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-sm">
                          {imageFileName || (newGame.image ? newGame.image.split('/').pop() : 'No file selected (will use placeholder)')}
                        </span>
                      </div>
                    </div>

                    {/* Video File Uploader */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Choose Game Video Trailer (Saved in public/videos/games/ & pushed to GitHub, Max 200MB)
                      </label>
                      <div className="flex gap-2.5 items-center">
                        <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                          <Video className="w-4 h-4 text-slate-500" />
                          SELECT VIDEO FILE
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-sm">
                          {videoFileName || (newGame.videoUrl ? newGame.videoUrl.split('/').pop() : 'No file selected')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-4">
                      {editingGameId && (
                        <RetroButton type="button" variant="gray" onClick={handleCancelEdit}>
                          CANCEL EDIT
                        </RetroButton>
                      )}
                      <RetroButton type="submit" variant="purple" className="flex items-center gap-2">
                        <Plus className="w-4.5 h-4.5" />
                        {editingGameId ? "UPDATE GAME RECORD" : "ADD GAME RECORD"}
                      </RetroButton>
                    </div>
                  </form>
                </RetroCard>

                {/* List: Existing Games */}
                <RetroCard variant="default" title="CURRENT GAMES RECORD">
                  <div className="flex flex-col gap-3">
                    {games.filter(g => g.type !== 'app').length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        NO GAMES LOADED IN ARCHIVE
                      </div>
                    ) : (
                      games.filter(g => g.type !== 'app').map((game) => {
                        const title = game.title[lang] || game.title['en'];
                        return (
                          <div
                            key={game.id}
                            className="flex items-center justify-between p-4 border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3.5 text-left">
                              <img
                                src={game.image}
                                alt={title}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-white/5 bg-slate-800"
                              />
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                                  {title} 
                                  {game.featured && (
                                    <span className="text-[9px] font-semibold text-purple-605 text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900/30 ml-1.5">
                                      featured
                                    </span>
                                  )}
                                </h4>
                                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                                  Genre: {game.genre} | Year: {game.releaseYear} | Platforms: {game.platform || 'None'} | URL: <a href={game.playUrl} target="_blank" rel="noopener noreferrer" className="underline text-[#0071e3] hover:text-[#147ce5]">{game.playUrl ? 'Link' : 'None'}</a>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditGame(game)}
                                className="p-2 border border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-955 bg-slate-900 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all active:scale-95"
                                aria-label="Edit Game"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteGame(game.id)}
                                className="p-2 border border-slate-200 dark:border-slate-800 bg-rose-50 dark:bg-rose-955 bg-slate-900 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-95"
                                aria-label="Delete Game"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </RetroCard>

              </div>
            )}

            {/* T1.5: APPLICATIONS MANAGER TAB */}
            {activeTab === 'apps' && (
              <div className="flex flex-col gap-6">

                {/* Form: Add App Wizard */}
                <RetroCard variant="default" title={editingGameId ? "EDIT APPLICATION RECORD" : "APPLICATION CREATOR WIZARD"} id="game-form">
                  <form 
                    onSubmit={(e) => {
                      newGame.type = 'app';
                      handleSaveGame(e);
                    }} 
                    className="flex flex-col gap-5 text-left"
                  >

                    {/* Multilang Titles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <RetroInput
                        id="title-en"
                        label="Application Title (English)"
                        value={newGame.titleEn}
                        onChange={(e) => setNewGame({ ...newGame, titleEn: e.target.value })}
                        required
                      />
                      <RetroInput
                        id="title-id"
                        label="Application Title (Indonesian)"
                        value={newGame.titleId}
                        onChange={(e) => setNewGame({ ...newGame, titleId: e.target.value })}
                      />
                      <RetroInput
                        id="title-jp"
                        label="Application Title (Japanese)"
                        value={newGame.titleJp}
                        onChange={(e) => setNewGame({ ...newGame, titleJp: e.target.value })}
                      />
                    </div>

                    {/* Multilang Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <RetroInput
                        id="desc-en"
                        label="Description (English)"
                        value={newGame.descEn}
                        onChange={(e) => setNewGame({ ...newGame, descEn: e.target.value })}
                        required
                      />
                      <RetroInput
                        id="desc-id"
                        label="Description (Indonesian)"
                        value={newGame.descId}
                        onChange={(e) => setNewGame({ ...newGame, descId: e.target.value })}
                      />
                      <RetroInput
                        id="desc-jp"
                        label="Description (Japanese)"
                        value={newGame.descJp}
                        onChange={(e) => setNewGame({ ...newGame, descJp: e.target.value })}
                      />
                    </div>

                    {/* Parameters */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <RetroInput
                        id="genre"
                        label="App Category"
                        value={newGame.genre}
                        onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                      />
                      <RetroInput
                        id="rating"
                        type="number"
                        label="Rating (1.0-5.0)"
                        value={newGame.rating}
                        onChange={(e) => setNewGame({ ...newGame, rating: e.target.value })}
                      />
                      <RetroInput
                        id="year"
                        type="number"
                        label="Release Year"
                        value={newGame.releaseYear}
                        onChange={(e) => setNewGame({ ...newGame, releaseYear: e.target.value })}
                      />

                      <div className="flex flex-col gap-1.5 justify-center">
                        <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                          Featured Status
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewGame({ ...newGame, featured: !newGame.featured })}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold select-none transition-all active:scale-95 ${
                            newGame.featured 
                              ? 'bg-[#0071e3] border-[#0071e3] text-white shadow-sm' 
                              : 'bg-white dark:bg-[#1c1c1e] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {newGame.featured ? 'FEATURED' : 'REGULAR'}
                        </button>
                      </div>
                    </div>

                    {/* App URL Input */}
                    <div className="w-full">
                      <RetroInput
                        id="playUrl"
                        label="App Website / Download Link (Play Store, App Store, webapps, etc.)"
                        value={newGame.playUrl}
                        onChange={(e) => setNewGame({ ...newGame, playUrl: e.target.value })}
                        placeholder="e.g., https://sukamajuhub.com or https://play.google.com/store/apps/details?id=..."
                      />
                    </div>

                    {/* Supported Platforms Checkboxes */}
                    <div className="flex flex-col gap-2 w-full text-left">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Supported Platforms (Windows, Linux, Mac, Android, iOS, Webapps)
                      </label>
                      <div className="flex flex-wrap gap-4 border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        {['Windows', 'Linux', 'Mac', 'Android', 'iOS', 'Webapps'].map((plat) => (
                          <label key={plat} className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700 dark:text-slate-350 font-medium">
                            <input
                              type="checkbox"
                              checked={!!selectedPlatforms[plat]}
                              onChange={() => {
                                playClick();
                                setSelectedPlatforms({
                                  ...selectedPlatforms,
                                  [plat]: !selectedPlatforms[plat]
                                });
                              }}
                              className="w-4 h-4 cursor-pointer accent-[#0071e3]"
                            />
                            <span className="text-xs uppercase text-slate-800 dark:text-slate-200">
                              {plat}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Image File Uploader */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Choose App Image Thumbnail (Saved in public/images/games/ & pushed to GitHub)
                      </label>
                      <div className="flex gap-2.5 items-center">
                        <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                          <Upload className="w-4 h-4 text-slate-500" />
                          SELECT IMAGE FILE
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-sm">
                          {imageFileName || (newGame.image ? newGame.image.split('/').pop() : 'No file selected (will use placeholder)')}
                        </span>
                      </div>
                    </div>

                    {/* Video File Uploader */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-semibold text-xs text-slate-500 dark:text-slate-400">
                        Choose App Video Trailer (Saved in public/videos/games/ & pushed to GitHub, Max 200MB)
                      </label>
                      <div className="flex gap-2.5 items-center">
                        <label className="cursor-pointer px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-sm active:scale-95 transition-all">
                          <Video className="w-4 h-4 text-slate-500" />
                          SELECT VIDEO FILE
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-sm">
                          {videoFileName || (newGame.videoUrl ? newGame.videoUrl.split('/').pop() : 'No file selected')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-white/5 pt-4">
                      {editingGameId && (
                        <RetroButton type="button" variant="gray" onClick={handleCancelEdit}>
                          CANCEL EDIT
                        </RetroButton>
                      )}
                      <RetroButton type="submit" variant="purple" className="flex items-center gap-2">
                        <Plus className="w-4.5 h-4.5" />
                        {editingGameId ? "UPDATE APPLICATION RECORD" : "ADD APPLICATION RECORD"}
                      </RetroButton>
                    </div>
                  </form>
                </RetroCard>

                {/* List: Existing Applications */}
                <RetroCard variant="default" title="CURRENT APPLICATIONS RECORD">
                  <div className="flex flex-col gap-3">
                    {games.filter(g => g.type === 'app').length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400 font-medium">
                        NO APPLICATIONS LOADED IN ARCHIVE
                      </div>
                    ) : (
                      games.filter(g => g.type === 'app').map((game) => {
                        const title = game.title[lang] || game.title['en'];
                        return (
                          <div
                            key={game.id}
                            className="flex items-center justify-between p-4 border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3.5 text-left">
                              <img
                                src={game.image}
                                alt={title}
                                className="w-12 h-12 object-cover rounded-xl border border-slate-200 dark:border-white/5 bg-slate-800"
                              />
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                                  {title} 
                                  {game.featured && (
                                    <span className="text-[9px] font-semibold text-purple-650 text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-100 dark:border-purple-900/30 ml-1.5">
                                      featured
                                    </span>
                                  )}
                                </h4>
                                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                                  Category: {game.genre} | Year: {game.releaseYear} | Platforms: {game.platform || 'None'} | URL: <a href={game.playUrl} target="_blank" rel="noopener noreferrer" className="underline text-[#0071e3] hover:text-[#147ce5]">{game.playUrl ? 'Link' : 'None'}</a>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditGame(game)}
                                className="p-2 border border-slate-200 dark:border-slate-800 bg-amber-50 dark:bg-amber-955 bg-slate-900 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all active:scale-95"
                                aria-label="Edit Application"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteGame(game.id)}
                                className="p-2 border border-slate-200 dark:border-slate-800 bg-rose-50 dark:bg-rose-955 bg-slate-900 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-95"
                                aria-label="Delete Application"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </RetroCard>

              </div>
            )}

            {/* T2: COLLABORATORS LOG TAB */}
            {activeTab === 'collaborators' && (
              <RetroCard variant="default" title="COLLABORATION_PROPOSALS">
                <div className="flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-slate-500">
                      Loaded {collaborators.length} collaborator profiles.
                    </span>
                    <RetroButton variant="outline" size="sm" onClick={loadCollaboratorsData} disabled={loadingCollabs}>
                      {loadingCollabs ? 'RELOADING...' : 'REFRESH DATA'}
                    </RetroButton>
                  </div>

                  {loadingCollabs ? (
                    <div className="py-12 text-center font-press text-[10px] uppercase text-slate-400 animate-pulse">
                      LOADING COLLABORATOR LOGS...
                    </div>
                  ) : collaborators.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-slate-250 dark:border-slate-800 p-6 rounded-2xl text-xs text-slate-400">
                      NO COLLABORATOR RECORDS REGISTERED YET
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {collaborators.map((collab) => (
                        <div
                          key={collab.id}
                          className="p-5 border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-[#1c1c1e]/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-all duration-150 flex flex-col gap-3.5"
                        >
                          {/* Info Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-white/5">
                            <div>
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {collab.name}
                              </span>
                              <span className="text-xs text-slate-400 font-medium block sm:inline sm:ml-2">
                                ({new Date(collab.timestamp).toLocaleString()})
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                              ID: {collab.id}
                            </span>
                          </div>

                          {/* Proposal Body */}
                          <div className="text-xs text-left">
                            <span className="text-xs text-[#0071e3] font-semibold block mb-1">PROPOSAL IDEA:</span>
                            <p className="font-sans text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 rounded-xl p-3 whitespace-pre-wrap leading-relaxed">
                              {collab.idea}
                            </p>
                          </div>

                          {/* Quick Contact buttons & Meet Scheduling */}
                          <div className="flex flex-wrap gap-2.5 pt-1.5 justify-end">
                            {/* WA */}
                            <a
                              href={`https://wa.me/${collab.phone}?text=${encodeURIComponent(`Hi ${collab.name}, thank you for submitting your project proposal to Sukamaju Hub! let's discuss...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 border border-slate-205 border-slate-200 dark:border-white/5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                              onClick={playClick}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>

                            {/* Email */}
                            <a
                              href={`mailto:${collab.email}?subject=Sukamaju Hub Open Collab Proposal&body=Hi ${collab.name}, let's talk about your idea...`}
                              className="px-4 py-2 border border-slate-205 border-slate-200 dark:border-white/5 text-xs font-semibold rounded-xl bg-indigo-605 bg-indigo-600 hover:bg-indigo-550 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-sm transition-all"
                              onClick={playClick}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Email
                            </a>

                            {/* Google Meet scheduling */}
                            <button
                              onClick={() => handleScheduleMeet(collab.name, collab.idea)}
                              className="px-4 py-2 border border-slate-205 border-slate-200 dark:border-white/5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-550 text-white flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Google Meet
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </RetroCard>
            )}

            {/* T3: SYNC CONFIG TAB */}
            {activeTab === 'config' && (
              <RetroCard variant="default" title="GITHUB_API_CONFIGURATION">
                <form onSubmit={handleSaveConfig} className="flex flex-col gap-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RetroInput
                      id="owner"
                      label="GitHub Owner / Username"
                      value={gitConfig.owner}
                      onChange={(e) => setGitConfig({ ...gitConfig, owner: e.target.value })}
                      required
                    />
                    <RetroInput
                      id="repo"
                      label="GitHub Repository Name"
                      value={gitConfig.repo}
                      onChange={(e) => setGitConfig({ ...gitConfig, repo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RetroInput
                      id="branch"
                      label="Target Git Branch"
                      value={gitConfig.branch}
                      onChange={(e) => setGitConfig({ ...gitConfig, branch: e.target.value })}
                      required
                    />
                    <RetroInput
                      id="path"
                      label="Target JSON File Path"
                      value={gitConfig.path}
                      onChange={(e) => setGitConfig({ ...gitConfig, path: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative">
                    <RetroInput
                      id="token"
                      type={tokenRevealed ? "text" : "password"}
                      label="GitHub Personal Access Token (PAT)"
                      placeholder="ghp_************************************"
                      value={gitConfig.token}
                      onChange={(e) => setGitConfig({ ...gitConfig, token: e.target.value })}
                      required
                      disabled={!tokenRevealed}
                    />
                    {!tokenRevealed && (
                      <button
                        type="button"
                        onClick={handleRevealToken}
                        className="absolute right-2 bottom-1.5 px-3 py-1 border-2 border-slate-950 dark:border-slate-100 bg-purple-600 hover:bg-purple-500 text-white font-press text-[7px] uppercase shadow-retro-sm"
                      >
                        REVEAL
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <RetroButton type="submit" variant="purple">
                      SAVE CONFIGURATION
                    </RetroButton>
                  </div>
                </form>
              </RetroCard>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
