const { cmd } = require('../command');

const games = new Map(); // key: chat id, value: game state

cmd({
    pattern: 'ttt2',
    alias: ['tictactoe2'],
    use: '.ttt2',
    desc: 'Start a Tic Tac Toe game, users can join by typing "join".',
    category: 'game',
    react: '❌⭕',
    filename: __filename
}, async (conn, mek, m, { from, text, reply }) => {
    try {
        if (games.has(from)) {
            return reply('A Tic Tac Toe game is already running here! Type "join" to participate or ".delttt" to cancel.');
        }

        // Initialize game state
        let game = {
            players: new Set(),
            board: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'],
            turn: null,
            timeout1: null,
            timeout2: null,
            started: false,
        };

        games.set(from, game);

        reply('Tic Tac Toe game created! Type "join" to participate. Waiting for players... (40 seconds)');

        // First timeout: warn at 40 seconds if no player joined
        game.timeout1 = setTimeout(() => {
            if (game.players.size < 2 && !game.started) {
                conn.sendMessage(from, { text: '⚠️ No enough players joined. Game will end in 17 seconds if nobody joins.' }, { quoted: mek });
            }
        }, 40000);

        // Second timeout: end game at 57 seconds (40 + 17)
        game.timeout2 = setTimeout(() => {
            if (game.players.size < 2 && !game.started) {
                conn.sendMessage(from, { text: '⚠️ Game ended due to lack of players.' }, { quoted: mek });
                games.delete(from);
            }
        }, 57000);

    } catch (e) {
        console.error(e);
        reply('Failed to start Tic Tac Toe game.');
    }
});

// Listen for "join" messages and moves
cmd({
    pattern: 'join',
    use: 'join',
    desc: 'Join the Tic Tac Toe game',
    category: 'game',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        if (!games.has(from)) return reply('No Tic Tac Toe game running. Type `.ttt` to start one.');

        let game = games.get(from);

        if (game.started) return reply('Game already started, wait for next round.');

        if (game.players.has(sender)) return reply('You already joined the game.');

        if (game.players.size >= 2) return reply('Game already has 2 players.');

        game.players.add(sender);

        reply(`Player joined: @${sender.split('@')[0]}`, { contextInfo: { mentionedJid: [sender] } });

        if (game.players.size === 2) {
            // Clear timeouts because game is starting
            clearTimeout(game.timeout1);
            clearTimeout(game.timeout2);

            // Start game
            game.started = true;
            game.turn = [...game.players][0]; // First player starts

            // Show initial board
            const board = game.board.map((v, i) => v === ' ' ? (i + 1) : v);

            const renderBoard = () => `
${board[0]} | ${board[1]} | ${board[2]}
---------
${board[3]} | ${board[4]} | ${board[5]}
---------
${board[6]} | ${board[7]} | ${board[8]}
            `;

            await conn.sendMessage(from, {
                text: `Game started!\n\nPlayers:\n❌ @${[...game.players][0].split('@')[0]} (X)\n⭕ @${[...game.players][1].split('@')[0]} (O)\n\n${renderBoard()}\n\n*${game.turn === [...game.players][0] ? '❌' : '⭕'}'s turn*\nType number (1-9) to make a move.`,
                contextInfo: { mentionedJid: [...game.players] }
            });
        }
    } catch (e) {
        console.error(e);
        reply('Error on join command.');
    }
});

// Command to cancel the current TTT game
cmd({
    pattern: 'delttt',
    use: '.delttt',
    desc: 'Cancel the current Tic Tac Toe game',
    category: 'game',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        if (!games.has(from)) return reply('No Tic Tac Toe game running.');

        clearTimeout(games.get(from).timeout1);
        clearTimeout(games.get(from).timeout2);
        games.delete(from);

        reply('Tic Tac Toe game cancelled.');
    } catch (e) {
        console.error(e);
        reply('Error cancelling game.');
    }
});

// Move command handler - detects numbers 1-9 to place mark
cmd({
    pattern: /^[1-9]$/,
    use: '<number>',
    desc: 'Make a move in Tic Tac Toe by typing a number (1-9)',
    category: 'game',
    filename: __filename
}, async (conn, mek, m, { from, sender, text, reply }) => {
    try {
        if (!games.has(from)) return; // No game running

        let game = games.get(from);

        if (!game.started) return; // Game not started

        if (sender !== game.turn) return reply('It is not your turn.');

        let pos = parseInt(text) - 1;

        if (game.board[pos] !== ' ') return reply('That position is already taken.');

        // Set player's mark
        const playerMark = [...game.players][0] === sender ? 'X' : 'O';
        game.board[pos] = playerMark;

        // Check win/draw
        const winCombos = [
            [0,1,2],[3,4,5],[6,7,8], // rows
            [0,3,6],[1,4,7],[2,5,8], // cols
            [0,4,8],[2,4,6]          // diagonals
        ];

        const checkWin = (board, mark) => {
            return winCombos.some(combo => combo.every(i => board[i] === mark));
        };

        const checkDraw = (board) => {
            return board.every(cell => cell !== ' ');
        };

        const renderBoard = () => `
${game.board[0]} | ${game.board[1]} | ${game.board[2]}
---------
${game.board[3]} | ${game.board[4]} | ${game.board[5]}
---------
${game.board[6]} | ${game.board[7]} | ${game.board[8]}
        `;

        // Check if current player wins
        if (checkWin(game.board, playerMark)) {
            await conn.sendMessage(from, {
                text: `${renderBoard()}\n\n🎉 Player @${sender.split('@')[0]} (${playerMark}) wins!`,
                contextInfo: { mentionedJid: [sender] }
            });
            games.delete(from);
            return;
        }

        // Check draw
        if (checkDraw(game.board)) {
            await conn.sendMessage(from, {
                text: `${renderBoard()}\n\nIt's a draw!`,
            });
            games.delete(from);
            return;
        }

        // Switch turn
        game.turn = [...game.players].find(p => p !== sender);

        await conn.sendMessage(from, {
            text: `${renderBoard()}\n\n*${game.turn === [...game.players][0] ? '❌' : '⭕'}'s turn*`,
            contextInfo: { mentionedJid: [game.turn] }
        });

    } catch (e) {
        console.error(e);
        reply('Error processing your move.');
    }
});