app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://examen-final-ia.vercel.app', // ✅ sin barra final
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
