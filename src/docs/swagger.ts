import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v.0.0.1",
    title: "BantuIn",
    description: "BantuIn API documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://back-end-bantuin.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      RegisterRequest: {
        fullname: "John Doe",
        username: "johndoe",
        email: "johndoe@gmail.com",
        password: "password",
        confirmPassword: "password",
      },
      LoginRequest: {
        identifier: "johndoe",
        password: "password",
      },
      ChangePasswordRequest: {
        currentPassword: "password",
        newPassword: "newpassword",
        confirmNewPassword: "newpassword",
      },

      CreateTransactionRequest: {
        name: "Salary",
        description: "Gaji bulan Agustus",
        amount: 10000000,
        date: "2025-08-02",
        type: "income",
        category: "Gaji",
      },

      CreateNoteRequest: {
        title: "Judul notes ditulis disini!",
        content: "Lorem ipsum dolor sit amet.",
        isPinned: false,
      },
      UpdateNoteRequest: {
        title: "Judul notes ditulis disini!",
        content: "Lorem ipsum dolor sit amet.",
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
