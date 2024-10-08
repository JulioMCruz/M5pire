#[allow(warnings)]
mod bindings;

use anyhow::anyhow;
use bindings::{Guest, Output, TaskQueueInput};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct TaskRequestData {
    pub email: String,
}

#[derive(Serialize, Debug)]
pub struct TaskResponseData {
    pub score: u8,
}

struct Component;

impl Guest for Component {
    fn run_task(request: TaskQueueInput) -> Output {
        // Desserializa a requisição para obter o email
        let TaskRequestData { email } = serde_json::from_slice(&request.request)
            .map_err(|e| anyhow!("Could not deserialize input request from JSON: {}", e))
            .unwrap();

        // Lista de domínios conhecidos com seus scores associados
        let domain_scores = vec![
            ("gmail.com", 8),
            ("outlook.com", 7),
            ("icloud.com", 10),
            ("yahoo.com", 9),
        ];

        // Extrai o domínio do email
        let email_parts: Vec<&str> = email.split('@').collect();
        let domain = email_parts.get(1).unwrap_or(&"");

        // Determina o score com base no domínio
        let score = domain_scores
            .iter()
            .find(|(known_domain, _)| known_domain == domain)
            .map(|(_, score)| *score)
            .unwrap_or(3); // Se o domínio não for encontrado, retorna 3

        println!("Email: {}, Score: {}", email, score);

        // Retorna o score como resposta
        Ok(serde_json::to_vec(&TaskResponseData { score })
            .map_err(|e| anyhow!("Could not serialize output data into JSON: {}", e))
            .unwrap())
    }
}

bindings::export!(Component with_types_in bindings);
