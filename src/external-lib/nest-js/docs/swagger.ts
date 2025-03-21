import { INestApplication } from '@nestjs/common';
import { APP_NAME } from '../../../shared/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function createSwaggerDocument(app: INestApplication<any>) {
  const documentBuilder = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(`${APP_NAME} API`)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token',
      },
      'JWT'
    )
    .addBasicAuth(
      {
        name: 'Basic authorization',
        type: 'http',
        scheme: 'basic',
        description: 'Username and password',
      },
      'BASIC_AUTH'
    );

  const config = documentBuilder.build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`api/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
