const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.User.create({
    data: {
      firstName: "júlio",
      lastName: "Carlos",
      fullName: "Júlio Carlos",
      email: "abc@gmail.com",
      password: "Alterar@123",
      phone: "12345678909",
      uuid: "227b293e-fcb5-11ec-b939-0242ac120002",
      createdAt: "2015-07-01T00:00:00Z",
      updatedAt: "2016-07-01T00:00:00Z",
    },
  });

  await prisma.Account.create({
    data: {
      uuid: user.uuid,
      birthdate: new Date(),
      cpf: "313.184.218-02",
      rg: "1234567767-76/90.77",
      nickname: "John Doe",
      picture: "string123", // TODO: banco de dados deveria receber um Blob
      description: "description",
      profession: "info",
      company: "zip",
    },
  });

  await prisma.Address.create({
    data: {
      uuid: user.uuid,
      street: "Rua 1",
      number: "1F",
      complement: "Apto 1",
      neighborhood: "Bairro",
      city: "Cidade",
      state: "SP",
      zipcode: "12345678905",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
