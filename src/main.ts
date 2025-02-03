import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('MonneyAPI')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, documentFactory, {
    customCss: `
      .swagger-ui section.models,
      .swagger-ui .topbar,
      .swagger-ui .response-controls,
      .swagger-ui .response-col_links { 
        display: none 
      }
    `,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
