# Account Service Node
Esse software propõe criar contas de usuário usando tecnologias Node.js como:
- express: como servidor
- winston: como logger
- prisma: para mapear banco de dados (ORM)

## Descrição das funções
### Criar usuário
O Sofware cria um usuário com nome, email, senha, comparação de senha, entre outros.
O email foi usuado como chave unica para registrar usuário; Na senha foi usado hash sha512 combinado com salt para reforçar segurança.
### Atualizar e deleter usuário
Há uma rota de atualização e deleção de usuário usando como chave o uuid, email, telefone.
Todos os campos são atualizados com excessão do próprio uuid e a senha.
Na deleção apenas muda o status da conta para desativado.
### Buscar usuário
Foram disponibilizadas diversas rotas para filtrar usuários.
É possível filtrar usuários por uuid, email, nome e telefone.
### Restauração de uma conta desativada
Há uma rota especifica para restaurar uma conta uma vez deletada.
O único requisito é possuir um uuid válido. 