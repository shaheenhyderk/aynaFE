import React, {useEffect, useState} from 'react';
import {
    Container,
    CssBaseline,
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Typography,
    Divider,
    IconButton,
    Drawer,
    useMediaQuery,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    AppBar,
    Toolbar,
    Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from 'react-router-dom';
import {listRooms, listMessages, createRoom, connectToRoom} from "../../api/chat";

export default function ChatPage() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [createRoomOpen, setCreateRoomOpen] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [ws, setWs] = useState(null);
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

    const username = localStorage.getItem('username'); // Retrieve username from local storage

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
            return;
        }

        async function fetchRooms() {
            const rooms = await listRooms();
            const data = rooms.data;
            setChatRooms(data);
            if (data.length > 0) {
                handleRoomSelect(data[0]);
            }
        }

        fetchRooms();
    }, [navigate]);

    async function fetchMessages(roomId) {
        const messages = await listMessages(roomId);
        setChat(messages);
    }

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            const newMessage = {
                content: message,
            };
            ws.send(JSON.stringify(newMessage));
            setMessage('');
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleCreateRoom = async () => {
        if (newRoomName.trim() !== '') {
            const newRoom = await createRoom(newRoomName);
            setChatRooms([...chatRooms, newRoom.data]);
            setNewRoomName('');
            setCreateRoomOpen(false);
            handleRoomSelect(newRoom.data);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleRoomSelect = async (room) => {
        setSelectedRoom(room);
        setDrawerOpen(false); // Close drawer on mobile after selecting a room
        fetchMessages(room.id);
        if (ws) {
            ws.close(); // Close existing WebSocket connection
        }

        const newWs = await connectToRoom(room.id);
        setWs(newWs);

        newWs.onmessage = (event) => {
            const incomingMessage = JSON.parse(event.data);
            setChat((prevChat) => [...prevChat, incomingMessage]);
        };

        newWs.onclose = () => {
            console.log("WebSocket closed.");
        };
    };

    const drawer = (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundImage: 'linearGradient(#0A0908, rgba(255, 255, 255, 0.15))'
        }}>
            <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column', p: 2}}>
                <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <Avatar alt="Logo" src="https://getayna.com/images/icon.svg"/>
                    <Box sx={{ml: 2}}>
                        <Typography variant="h6">
                            Chat Rooms
                        </Typography>
                        <Typography variant="caption" sx={{color: 'grey.500'}}>
                            {username} {/* Assuming 'username' is accessible here */}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider/>
            <List sx={{flexGrow: 1}}>
                {chatRooms && chatRooms.map((room) => (
                    <ListItem
                        button
                        key={room.id}
                        selected={selectedRoom && selectedRoom.id === room.id}
                        onClick={() => handleRoomSelect(room)}
                    >
                        <ListItemText primary={room.attributes.name}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <Box sx={{p: 2}}>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{borderRadius: 3}}
                    onClick={() => setCreateRoomOpen(true)}
                >
                    Create Room
                </Button>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{mt: 2, backgroundColor: '#F06543', '&:hover': {backgroundColor: 'darkred'}, borderRadius: 3}}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </Box>


    );

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    bgcolor: 'background.default',
                    color: 'text.primary',
                }}
            >
                {isMobile && (
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{mr: 2}}
                            >
                                <MenuIcon/>
                            </IconButton>
                            <Typography variant="h6" noWrap component="div">
                                Chat Rooms
                            </Typography>
                            <Avatar alt="Logo" src="https://getayna.com/images/icon.svg" sx={{ml: 'auto'}}/>
                            {username && (
                                <Typography variant="body1" sx={{ml: 2}}>
                                    {username}
                                </Typography>
                            )}
                        </Toolbar>
                    </AppBar>
                )}

                <Box sx={{display: 'flex', flexGrow: 1}}>
                    {!isMobile && (
                        <Box
                            sx={{
                                width: '25%',
                                borderRight: 1,
                                borderColor: 'divider',
                                overflow: 'auto',
                            }}
                        >
                            {drawer}
                        </Box>
                    )}

                    {/* Chat Window */}
                    <Box
                        sx={{
                            width: isMobile ? '100%' : '75%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                p: 2,
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {chat && chat.map((chat) => (
                                <Box
                                    key={chat.id}
                                    sx={{
                                        alignSelf: chat.sender_type === 'USER' ? 'flex-end' : 'flex-start',
                                        bgcolor: chat.sender_type === 'USER' ? '#E0DFD5' : '#F09D51',
                                        color: '#000000',
                                        p: 1,
                                        borderRadius: 3,
                                        maxWidth: '60%',
                                        mb: 1,
                                    }}
                                >
                                    {chat.content}
                                </Box>
                            ))}
                        </Box>
                        {selectedRoom && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    p: 2,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Type a message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendMessage();
                                        }
                                    }}
                                    sx={{mr: 2}}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSendMessage()}
                                    sx={{borderRadius: 3}}
                                >
                                    Send
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Create Room Dialog */}
            <Dialog open={createRoomOpen} onClose={() => setCreateRoomOpen(false)}>
                <DialogTitle>Create a new chat room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for the new chat room.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        fullWidth
                        variant="outlined"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCreateRoomOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateRoom} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>
        </Container>
    );
}
