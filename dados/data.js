// Dados da EcoLogística S.A.

// Tabela Frota
const dadosFrota = [
    { idVeiculo: 'V001', modelo: 'Mercedes Sprinter', capacidadeCarga: '3500kg' },
    { idVeiculo: 'V002', modelo: 'IVECO Daily', capacidadeCarga: '3000kg' },
    { idVeiculo: 'V003', modelo: 'Ford Transit', capacidadeCarga: '2500kg' },
    { idVeiculo: 'V004', modelo: 'Renault Master', capacidadeCarga: '2800kg' },
    { idVeiculo: 'V005', modelo: 'Volkswagen Crafter', capacidadeCarga: '3200kg' }
];

// Tabela Motoristas
const dadosMotoristas = [
    { idMotorista: 'M001', nome: 'João Silva', regiao: 'Norte' },
    { idMotorista: 'M002', nome: 'Maria Santos', regiao: 'Sul' },
    { idMotorista: 'M003', nome: 'Pedro Costa', regiao: 'Norte' },
    { idMotorista: 'M004', nome: 'Ana Oliveira', regiao: 'Centro' },
    { idMotorista: 'M005', nome: 'Carlos Pereira', regiao: 'Sul' }
];

// Tabela Entregas (dados simulados para demonstração)
const dadosEntregas = [
    // Janeiro 2024
    { data: new Date(2024, 0, 5), idVeiculo: 'V001', idMotorista: 'M001', distanciaPercorrida: 150, custoCombustivel: 125.50, valorEntrega: 450.00, status: 'Entregue', mes: 0 },
    { data: new Date(2024, 0, 8), idVeiculo: 'V002', idMotorista: 'M002', distanciaPercorrida: 200, custoCombustivel: 167.30, valorEntrega: 580.00, status: 'Entregue', mes: 0 },
    { data: new Date(2024, 0, 12), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 180, custoCombustivel: 150.80, valorEntrega: 520.00, status: 'Atrasado', mes: 0 },
    { data: new Date(2024, 0, 15), idVeiculo: 'V004', idMotorista: 'M004', distanciaPercorrida: 220, custoCombustivel: 184.20, valorEntrega: 640.00, status: 'Entregue', mes: 0 },
    { data: new Date(2024, 0, 20), idVeiculo: 'V005', idMotorista: 'M005', distanciaPercorrida: 190, custoCombustivel: 159.10, valorEntrega: 550.00, status: 'Entregue', mes: 0 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 0 },
    { data: new Date(2024, 0, 26), idVeiculo: 'V004', idMotorista: 'M002', distanciaPercorrida: 130, custoCombustivel: 113.90, valorEntrega: 270.00, status: 'Atrasado', mes: 0 },

    // Fevereiro 2024
    { data: new Date(2024, 1, 3), idVeiculo: 'V002', idMotorista: 'M001', distanciaPercorrida: 210, custoCombustivel: 175.80, valorEntrega: 610.00, status: 'Entregue', mes: 1 },
    { data: new Date(2024, 1, 7), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 170, custoCombustivel: 142.30, valorEntrega: 500.00, status: 'Entregue', mes: 1 },
    { data: new Date(2024, 1, 11), idVeiculo: 'V004', idMotorista: 'M004', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 700.00, status: 'Entregue', mes: 1 },
    { data: new Date(2024, 1, 15), idVeiculo: 'V005', idMotorista: 'M005', distanciaPercorrida: 195, custoCombustivel: 163.20, valorEntrega: 570.00, status: 'Atrasado', mes: 1 },
    { data: new Date(2024, 1, 20), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 540.00, status: 'Entregue', mes: 1 },
    { data: new Date(2024, 1, 25), idVeiculo: 'V003', idMotorista: 'M001', distanciaPercorrida: 175, custoCombustivel: 146.50, valorEntrega: 510.00, status: 'Entregue', mes: 1 },
    
    // Março 2024
    { data: new Date(2024, 2, 2), idVeiculo: 'V004', idMotorista: 'M003', distanciaPercorrida: 230, custoCombustivel: 192.50, valorEntrega: 670.00, status: 'Entregue', mes: 2 },
    { data: new Date(2024, 2, 6), idVeiculo: 'V005', idMotorista: 'M004', distanciaPercorrida: 200, custoCombustivel: 167.40, valorEntrega: 590.00, status: 'Atrasado', mes: 2 },
    { data: new Date(2024, 2, 10), idVeiculo: 'V001', idMotorista: 'M005', distanciaPercorrida: 165, custoCombustivel: 138.10, valorEntrega: 480.00, status: 'Entregue', mes: 2 },
    { data: new Date(2024, 2, 14), idVeiculo: 'V002', idMotorista: 'M001', distanciaPercorrida: 215, custoCombustivel: 180.00, valorEntrega: 630.00, status: 'Entregue', mes: 2 },
    { data: new Date(2024, 2, 18), idVeiculo: 'V003', idMotorista: 'M002', distanciaPercorrida: 190, custoCombustivel: 159.00, valorEntrega: 560.00, status: 'Entregue', mes: 2 },
    { data: new Date(2024, 2, 22), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 205, custoCombustivel: 171.60, valorEntrega: 600.00, status: 'Atrasado', mes: 2 },
    
    // Abril 2024
    { data: new Date(2024, 3, 4), idVeiculo: 'V001', idMotorista: 'M004', distanciaPercorrida: 180, custoCombustivel: 150.70, valorEntrega: 530.00, status: 'Entregue', mes: 3 },
    { data: new Date(2024, 3, 8), idVeiculo: 'V002', idMotorista: 'M005', distanciaPercorrida: 220, custoCombustivel: 184.10, valorEntrega: 650.00, status: 'Entregue', mes: 3 },
    { data: new Date(2024, 3, 12), idVeiculo: 'V004', idMotorista: 'M001', distanciaPercorrida: 195, custoCombustivel: 163.20, valorEntrega: 575.00, status: 'Entregue', mes: 3 },
    { data: new Date(2024, 3, 16), idVeiculo: 'V003', idMotorista: 'M002', distanciaPercorrida: 210, custoCombustivel: 175.80, valorEntrega: 620.00, status: 'Atrasado', mes: 3 },
    { data: new Date(2024, 3, 20), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 545.00, status: 'Entregue', mes: 3 },
    { data: new Date(2024, 3, 24), idVeiculo: 'V002', idMotorista: 'M004', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 710.00, status: 'Entregue', mes: 3 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V003', idMotorista: 'M002', distanciaPercorrida: 260, custoCombustivel: 193.90, valorEntrega: 490.00, status: 'Atrasado', mes: 3 },

    // Maio 2024
    { data: new Date(2024, 4, 3), idVeiculo: 'V003', idMotorista: 'M005', distanciaPercorrida: 175, custoCombustivel: 146.50, valorEntrega: 515.00, status: 'Entregue', mes: 4 },
    { data: new Date(2024, 4, 7), idVeiculo: 'V001', idMotorista: 'M001', distanciaPercorrida: 200, custoCombustivel: 167.40, valorEntrega: 590.00, status: 'Atrasado', mes: 4 },
    { data: new Date(2024, 4, 11), idVeiculo: 'V005', idMotorista: 'M002', distanciaPercorrida: 215, custoCombustivel: 180.00, valorEntrega: 635.00, status: 'Entregue', mes: 4 },
    { data: new Date(2024, 4, 15), idVeiculo: 'V004', idMotorista: 'M003', distanciaPercorrida: 190, custoCombustivel: 159.00, valorEntrega: 560.00, status: 'Entregue', mes: 4 },
    { data: new Date(2024, 4, 19), idVeiculo: 'V002', idMotorista: 'M004', distanciaPercorrida: 230, custoCombustivel: 192.50, valorEntrega: 680.00, status: 'Entregue', mes: 4 },
    { data: new Date(2024, 4, 23), idVeiculo: 'V001', idMotorista: 'M005', distanciaPercorrida: 165, custoCombustivel: 138.10, valorEntrega: 485.00, status: 'Atrasado', mes: 4 },
    
    // Junho 2024
    { data: new Date(2024, 5, 2), idVeiculo: 'V004', idMotorista: 'M001', distanciaPercorrida: 210, custoCombustivel: 175.80, valorEntrega: 620.00, status: 'Entregue', mes: 5 },
    { data: new Date(2024, 5, 6), idVeiculo: 'V005', idMotorista: 'M002', distanciaPercorrida: 195, custoCombustivel: 163.20, valorEntrega: 575.00, status: 'Entregue', mes: 5 },
    { data: new Date(2024, 5, 10), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 180, custoCombustivel: 150.70, valorEntrega: 530.00, status: 'Atrasado', mes: 5 },
    { data: new Date(2024, 5, 14), idVeiculo: 'V001', idMotorista: 'M004', distanciaPercorrida: 220, custoCombustivel: 184.10, valorEntrega: 650.00, status: 'Entregue', mes: 5 },
    { data: new Date(2024, 5, 18), idVeiculo: 'V002', idMotorista: 'M005', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 710.00, status: 'Entregue', mes: 5 },
    { data: new Date(2024, 5, 22), idVeiculo: 'V005', idMotorista: 'M001', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 545.00, status: 'Entregue', mes: 5 },
    { data: new Date(2024, 0, 23), idVeiculo: 'V004', idMotorista: 'M003', distanciaPercorrida: 260, custoCombustivel: 193.90, valorEntrega: 570.00, status: 'Atrasado', mes: 5 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 5 },

    // Julho 2024
    { data: new Date(2024, 0, 5), idVeiculo: 'V001', idMotorista: 'M001', distanciaPercorrida: 150, custoCombustivel: 125.50, valorEntrega: 450.00, status: 'Entregue', mes: 6 },
    { data: new Date(2024, 0, 8), idVeiculo: 'V002', idMotorista: 'M002', distanciaPercorrida: 200, custoCombustivel: 167.30, valorEntrega: 580.00, status: 'Entregue', mes: 6 },
    { data: new Date(2024, 0, 12), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 180, custoCombustivel: 150.80, valorEntrega: 520.00, status: 'Atrasado', mes: 6 },
    { data: new Date(2024, 0, 15), idVeiculo: 'V004', idMotorista: 'M004', distanciaPercorrida: 220, custoCombustivel: 184.20, valorEntrega: 640.00, status: 'Entregue', mes: 6 },
    { data: new Date(2024, 0, 20), idVeiculo: 'V005', idMotorista: 'M005', distanciaPercorrida: 190, custoCombustivel: 159.10, valorEntrega: 550.00, status: 'Entregue', mes: 6 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 6 },
    { data: new Date(2024, 0, 26), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 260, custoCombustivel: 233.90, valorEntrega: 570.00, status: 'Atrasado', mes: 6 },

    // Agosto 2024
    { data: new Date(2024, 1, 3), idVeiculo: 'V002', idMotorista: 'M001', distanciaPercorrida: 210, custoCombustivel: 175.80, valorEntrega: 610.00, status: 'Entregue', mes: 7 },
    { data: new Date(2024, 1, 7), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 170, custoCombustivel: 142.30, valorEntrega: 500.00, status: 'Entregue', mes: 7 },
    { data: new Date(2024, 1, 11), idVeiculo: 'V004', idMotorista: 'M004', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 700.00, status: 'Entregue', mes: 7 },
    { data: new Date(2024, 1, 15), idVeiculo: 'V005', idMotorista: 'M005', distanciaPercorrida: 195, custoCombustivel: 163.20, valorEntrega: 570.00, status: 'Atrasado', mes: 7 },
    { data: new Date(2024, 1, 20), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 540.00, status: 'Entregue', mes: 7 },
    { data: new Date(2024, 1, 25), idVeiculo: 'V003', idMotorista: 'M001', distanciaPercorrida: 175, custoCombustivel: 146.50, valorEntrega: 510.00, status: 'Entregue', mes: 7 },
    { data: new Date(2024, 0, 27), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 180, custoCombustivel: 163.90, valorEntrega: 560.00, status: 'Atrasado', mes: 7 },
    
    // Setembro 2024
    { data: new Date(2024, 2, 2), idVeiculo: 'V004', idMotorista: 'M003', distanciaPercorrida: 130, custoCombustivel: 102.50, valorEntrega: 470.00, status: 'Entregue', mes: 8 },
    { data: new Date(2024, 2, 6), idVeiculo: 'V005', idMotorista: 'M004', distanciaPercorrida: 100, custoCombustivel: 101.40, valorEntrega: 390.00, status: 'Atrasado', mes: 8 },
    { data: new Date(2024, 2, 10), idVeiculo: 'V003', idMotorista: 'M005', distanciaPercorrida: 165, custoCombustivel: 138.10, valorEntrega: 480.00, status: 'Entregue', mes: 8 },
    { data: new Date(2024, 2, 14), idVeiculo: 'V002', idMotorista: 'M001', distanciaPercorrida: 215, custoCombustivel: 180.00, valorEntrega: 630.00, status: 'Entregue', mes: 8 },
    { data: new Date(2024, 2, 18), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 190, custoCombustivel: 159.00, valorEntrega: 560.00, status: 'Entregue', mes: 8 },
    { data: new Date(2024, 2, 22), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 205, custoCombustivel: 171.60, valorEntrega: 600.00, status: 'Atrasado', mes: 8 },
    
    // Outobro 2024
    { data: new Date(2024, 3, 4), idVeiculo: 'V001', idMotorista: 'M004', distanciaPercorrida: 180, custoCombustivel: 150.70, valorEntrega: 530.00, status: 'Entregue', mes: 9 },
    { data: new Date(2024, 3, 8), idVeiculo: 'V002', idMotorista: 'M005', distanciaPercorrida: 220, custoCombustivel: 184.10, valorEntrega: 650.00, status: 'Entregue', mes: 9 },
    { data: new Date(2024, 3, 12), idVeiculo: 'V004', idMotorista: 'M001', distanciaPercorrida: 195, custoCombustivel: 163.20, valorEntrega: 575.00, status: 'Entregue', mes: 9 },
    { data: new Date(2024, 3, 16), idVeiculo: 'V003', idMotorista: 'M002', distanciaPercorrida: 210, custoCombustivel: 175.80, valorEntrega: 620.00, status: 'Atrasado', mes: 9 },
    { data: new Date(2024, 3, 20), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 545.00, status: 'Entregue', mes: 9 },
    { data: new Date(2024, 3, 24), idVeiculo: 'V002', idMotorista: 'M004', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 710.00, status: 'Entregue', mes: 9 },
    
    // Novembro 2024
    { data: new Date(2024, 4, 3), idVeiculo: 'V003', idMotorista: 'M005', distanciaPercorrida: 175, custoCombustivel: 146.50, valorEntrega: 515.00, status: 'Entregue', mes: 10 },
    { data: new Date(2024, 4, 7), idVeiculo: 'V001', idMotorista: 'M001', distanciaPercorrida: 200, custoCombustivel: 167.40, valorEntrega: 590.00, status: 'Atrasado', mes: 10 },
    { data: new Date(2024, 4, 11), idVeiculo: 'V005', idMotorista: 'M002', distanciaPercorrida: 215, custoCombustivel: 180.00, valorEntrega: 635.00, status: 'Entregue', mes: 10 },
    { data: new Date(2024, 4, 15), idVeiculo: 'V004', idMotorista: 'M003', distanciaPercorrida: 190, custoCombustivel: 159.00, valorEntrega: 560.00, status: 'Entregue', mes: 10 },
    { data: new Date(2024, 4, 19), idVeiculo: 'V002', idMotorista: 'M004', distanciaPercorrida: 230, custoCombustivel: 192.50, valorEntrega: 680.00, status: 'Entregue', mes: 10 },
    { data: new Date(2024, 4, 23), idVeiculo: 'V001', idMotorista: 'M005', distanciaPercorrida: 165, custoCombustivel: 138.10, valorEntrega: 485.00, status: 'Atrasado', mes: 10 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V002', idMotorista: 'M001', distanciaPercorrida: 200, custoCombustivel: 233.90, valorEntrega: 670.00, status: 'Atrasado', mes: 10 },
    { data: new Date(2024, 0, 25), idVeiculo: 'V001', idMotorista: 'M002', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 10 },
    
    // Desembro 2024
    { data: new Date(2024, 5, 2), idVeiculo: 'V004', idMotorista: 'M001', distanciaPercorrida: 120, custoCombustivel: 100.80, valorEntrega: 420.00, status: 'Entregue', mes: 11 },
    { data: new Date(2024, 5, 6), idVeiculo: 'V003', idMotorista: 'M002', distanciaPercorrida: 210, custoCombustivel: 183.20, valorEntrega: 675.00, status: 'Entregue', mes: 11 },
    { data: new Date(2024, 5, 10), idVeiculo: 'V005', idMotorista: 'M003', distanciaPercorrida: 180, custoCombustivel: 150.70, valorEntrega: 530.00, status: 'Atrasado', mes: 11 },
    { data: new Date(2024, 5, 14), idVeiculo: 'V001', idMotorista: 'M004', distanciaPercorrida: 220, custoCombustivel: 184.10, valorEntrega: 650.00, status: 'Entregue', mes: 11 },
    { data: new Date(2024, 5, 18), idVeiculo: 'V002', idMotorista: 'M005', distanciaPercorrida: 240, custoCombustivel: 200.90, valorEntrega: 710.00, status: 'Entregue', mes: 11 },
    { data: new Date(2024, 5, 22), idVeiculo: 'V005', idMotorista: 'M001', distanciaPercorrida: 185, custoCombustivel: 154.90, valorEntrega: 545.00, status: 'Entregue', mes: 11 },
    { data: new Date(2024, 0, 24), idVeiculo: 'V003', idMotorista: 'M003', distanciaPercorrida: 180, custoCombustivel: 143.90, valorEntrega: 545.00, status: 'Atrasado', mes: 11 }, 
    { data: new Date(2024, 0, 25), idVeiculo: 'V004', idMotorista: 'M004', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 11 },
    { data: new Date(2024, 0, 28), idVeiculo: 'V001', idMotorista: 'M005', distanciaPercorrida: 160, custoCombustivel: 133.90, valorEntrega: 470.00, status: 'Atrasado', mes: 11 },
];

// Exportar dados para uso global
window.dadosFrota = dadosFrota;
window.dadosMotoristas = dadosMotoristas;
window.dadosEntregas = dadosEntregas;