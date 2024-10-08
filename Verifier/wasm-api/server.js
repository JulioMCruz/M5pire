const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

// Middleware para processar dados em JSON
app.use(express.json());

// Rota para receber o email e retornar o score
app.post('/get-score', (req, res) => {
    const email = req.body.email;

    // Verifica se o email foi fornecido
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Monta o comando para executar o AVS Toolkit com o email fornecido
    const command = `avs-toolkit-cli wasmatic run --wasm-source ../avs-toolkit-main/target/wasm32-wasip1/release/layer_verifier.wasm --input '{"email":"${email}"}'`;

    // Executa o comando no terminal
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Error executing command' });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Error in command output' });
        }

        // Retorna o resultado do comando (o score) como resposta
        return res.status(200).json({ score: stdout.trim() });
    });
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
