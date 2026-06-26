import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, KeyRound, Settings, LayoutGrid, CheckCircle, Users, Mail, MessageSquare, Video, Upload } from 'lucide-react';
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
    genre: 'RPG / Adventure',
    rating: 4.5,
    releaseYear: new Date().getFullYear(),
    image: '',
    featured: false
  });

  // Selected Image File for upload
  const [imageFile, setImageFile] = useState(null);
  const [imageFileName, setImageFileName] = useState('');

  // Github form configs
  const [gitConfig, setGitConfig] = useState({
    owner: githubOwner || 'itsmebroarif',
    repo: githubRepo || 'kafeinarts-studio',
    branch: githubBranch || 'main',
    path: githubPath || 'src/data/games.json',
    token: githubToken || ''
  });

  // Sync state with store once store values load
  useEffect(() => {
    setGitConfig({
      owner: githubOwner || 'itsmebroarif',
      repo: githubRepo || 'kafeinarts-studio',
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

  const handleAddGame = (e) => {
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
      // Store the file blob for push if it is a local upload
      _file: imageFile,
      _fileName: imageFileName
    };

    setGames([...games, gameToAdd]);
    playSuccess();

    // Reset Form & File Selection
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
      featured: false
    });
    setImageFile(null);
    setImageFileName('');
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

      // 2. Clear temp file attachments from JSON list
      const gamesClean = games.map(g => {
        const clean = { ...g };
        delete clean._file;
        delete clean._fileName;
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
        message: 'feat: update games.json database via KafeinArts Admin Panel',
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
        let inviteMsg = `*📅 GOOGLE MEET INVITATION - KAFEINARTS STUDIO*\n`;
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
              <div className="w-16 h-16 border-4 border-slate-950 dark:border-slate-100 bg-purple-600 text-white flex items-center justify-center shadow-retro">
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
    <div className="py-6 px-4 md:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 font-inter">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-4 border-slate-950 dark:border-slate-100 bg-purple-600 text-white p-4 shadow-retro">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
            <div className="text-left font-press uppercase">
              <h1 className="text-xs sm:text-sm tracking-wide">SYSTEMS ADMIN WORKSPACE</h1>
              <span className="text-[7px] text-purple-200 font-normal">GitHub Repositories Sync Client v1.1</span>
            </div>
          </div>
          <RetroButton
            variant="gray"
            size="sm"
            onClick={triggerLogout}
            className="mt-3 sm:mt-0 text-[8px]"
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
            <RetroCard variant="default" title="SIDEBAR_NAV">
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                <button
                  onClick={() => { playClick(); setActiveTab('games'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left p-3 border-2 border-slate-950 dark:border-slate-100 font-press text-[9px] uppercase shadow-retro-sm flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'games' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Games
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('collaborators'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left p-3 border-2 border-slate-950 dark:border-slate-100 font-press text-[9px] uppercase shadow-retro-sm flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'collaborators' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Collaborators
                </button>
                <button
                  onClick={() => { playClick(); setActiveTab('config'); }}
                  onMouseEnter={playHover}
                  className={`flex-1 md:w-full text-left p-3 border-2 border-slate-950 dark:border-slate-100 font-press text-[9px] uppercase shadow-retro-sm flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'config' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                <RetroCard variant="default" title="GAME_CREATOR_WIZARD">
                  <form onSubmit={handleAddGame} className="flex flex-col gap-4 text-left">
                    
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
                        <label className="font-press text-[9px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Featured Status
                        </label>
                        <button
                          type="button"
                          onClick={() => setNewGame({ ...newGame, featured: !newGame.featured })}
                          className={`px-3 py-2 border-2 border-slate-950 dark:border-slate-100 font-press text-[8px] uppercase select-none ${
                            newGame.featured ? 'bg-purple-600 text-white shadow-retro-sm' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-2'
                          }`}
                        >
                          {newGame.featured ? 'FEATURED' : 'REGULAR'}
                        </button>
                      </div>
                    </div>

                    {/* Image File Uploader */}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="font-press text-[9px] uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Choose Game Image Thumbnail (Saved in public/images/games/ & pushed to GitHub)
                      </label>
                      <div className="flex gap-2 items-center">
                        <label className="cursor-pointer px-4 py-2.5 border-2 border-slate-955 border-slate-950 dark:border-slate-100 font-press text-[9px] uppercase bg-slate-100 dark:bg-slate-900 shadow-retro-sm active:translate-y-[1px] hover:bg-slate-200 flex items-center gap-1.5">
                          <Upload className="w-4 h-4" />
                          SELECT IMAGE FILE
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageFileChange} 
                            className="hidden" 
                          />
                        </label>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-sm">
                          {imageFileName || 'No file selected (will use placeholder)'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <RetroButton type="submit" variant="purple" className="flex items-center gap-2">
                        <Plus className="w-4.5 h-4.5" />
                        ADD GAME RECORD
                      </RetroButton>
                    </div>
                  </form>
                </RetroCard>

                {/* List: Existing Games */}
                <RetroCard variant="default" title="CURRENT_GAMES_RECORD">
                  <div className="flex flex-col gap-3">
                    {games.map((game) => {
                      const title = game.title[lang] || game.title['en'];
                      return (
                        <div 
                          key={game.id}
                          className="flex items-center justify-between p-3 border-2 border-slate-955 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 shadow-retro-sm"
                        >
                          <div className="flex items-center gap-3 text-left">
                            <img
                              src={game.image}
                              alt={title}
                              className="w-10 h-10 object-cover border-2 border-slate-950 dark:border-slate-100 bg-slate-800"
                            />
                            <div>
                              <h4 className="font-press text-[9px] uppercase text-slate-905 text-slate-900 dark:text-slate-100">
                                {title} {game.featured && <span className="text-[7px] text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-1 border border-purple-650 ml-1">featured</span>}
                              </h4>
                              <span className="font-mono text-[9px] text-slate-500 block">
                                Genre: {game.genre} | Year: {game.releaseYear} | Path: {game.image}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteGame(game.id)}
                            className="p-2 border-2 border-slate-950 dark:border-slate-100 bg-rose-50 dark:bg-rose-950/20 text-rose-500 hover:bg-rose-500 hover:text-white shadow-retro-sm transition-colors duration-150"
                            aria-label="Delete Game"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
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
                    <div className="py-12 text-center border-2 border-dashed p-6 font-press text-[9px] text-slate-550 dark:text-slate-450 uppercase">
                      NO COLLABORATOR RECORDS REGISTERED YET
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {collaborators.map((collab) => (
                        <div 
                          key={collab.id} 
                          className="p-4 border-2 border-slate-950 dark:border-slate-100 bg-white dark:bg-slate-950 shadow-retro-sm flex flex-col gap-3"
                        >
                          {/* Info Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-150 dark:border-slate-800">
                            <div>
                              <span className="font-press text-[10px] uppercase font-bold text-slate-900 dark:text-slate-100">
                                {collab.name}
                              </span>
                              <span className="font-mono text-[9px] text-slate-400 block sm:inline sm:ml-2">
                                ({new Date(collab.timestamp).toLocaleString()})
                              </span>
                            </div>
                            <span className="font-mono text-[9px] text-slate-500">
                              ID: {collab.id}
                            </span>
                          </div>

                          {/* Proposal Body */}
                          <div className="text-xs">
                            <span className="font-press text-[7.5px] text-purple-600 dark:text-cyan-400 uppercase font-bold block mb-1">PROPOSAL IDEA:</span>
                            <p className="font-inter text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 border p-3 whitespace-pre-wrap">
                              {collab.idea}
                            </p>
                          </div>

                          {/* Quick Contact buttons & Meet Scheduling */}
                          <div className="flex flex-wrap gap-2.5 pt-1.5 justify-end">
                            {/* WA */}
                            <a
                              href={`https://wa.me/${collab.phone}?text=${encodeURIComponent(`Hi ${collab.name}, thank you for submitting your project proposal to KafeinArts Studio! let's discuss...`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 border-2 border-slate-950 dark:border-slate-100 font-press text-[7.5px] uppercase bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-retro-sm"
                              onClick={playClick}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              WhatsApp
                            </a>

                            {/* Email */}
                            <a
                              href={`mailto:${collab.email}?subject=KafeinArts Open Collab Proposal&body=Hi ${collab.name}, let's talk about your idea...`}
                              className="px-3 py-1.5 border-2 border-slate-955 border-slate-950 dark:border-slate-100 font-press text-[7.5px] uppercase bg-indigo-500 hover:bg-indigo-400 text-white flex items-center gap-1.5 shadow-retro-sm"
                              onClick={playClick}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Email
                            </a>

                            {/* Google Meet scheduling */}
                            <button
                              onClick={() => handleScheduleMeet(collab.name, collab.idea)}
                              className="px-3 py-1.5 border-2 border-slate-950 dark:border-slate-100 font-press text-[7.5px] uppercase bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-retro-sm"
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
