import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFile = ["../routes/api.ts"];
const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API BantuIn",
    description: "Dokumentasi API BantuIn",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "http://back-end-bantuin.vercel.app/api",
      description: "Deploy Server",
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
    },
  },
};

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFile, doc);
