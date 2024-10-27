import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;


async function bootstrap() {


  const app = await NestFactory.create(AppModule, { cors: {
    credentials: false,
    origin: ["http://localhost:3000", "htps://course-platform-gamma-green.vercel.app"],
    allowedHeaders: ['content-type', 'timezone'],
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"]
  }});

  app.use(function (req, res, next) {

    const corsWhitelist = [
         'http://localhost:3000', 
         'htps://course-platform-gamma-green.vercel.app'
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin );
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

  const config = new DocumentBuilder()
  .setTitle('Cats example')
  .setDescription('The cats API description')
  .setVersion('1.0')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  
}
bootstrap();
