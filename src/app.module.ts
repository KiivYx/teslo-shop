import { join } from 'path';

// Importa 'OnModuleInit' y 'ConfigService' si no lo tienes ya
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Asegúrate de que ConfigService esté aquí
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { MessagesWsModule } from './messages-ws/messages-ws.module';

@Module({
  imports: [
    // 1. Configura ConfigModule como global
    ConfigModule.forRoot({
      isGlobal: true, // ¡Esta línea es crucial para que las variables estén disponibles globalmente!
    }),

    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl:
          process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
    MessagesWsModule,
  ],
})
// 2. Implementa OnModuleInit y añade el constructor para inyectar ConfigService
export class AppModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  // 3. Añade los console.log de depuración aquí
  onModuleInit() {
    console.log('--- Debug de Conexión a DB desde AppModule ---');
    console.log('DB_HOST:', this.configService.get<string>('DB_HOST'));
    console.log('DB_PORT:', this.configService.get<number>('DB_PORT'));
    console.log('DB_NAME:', this.configService.get<string>('DB_NAME'));
    console.log('DB_USERNAME:', this.configService.get<string>('DB_USERNAME'));
    console.log(
      'DB_PASSWORD (raw):',
      this.configService.get<string>('DB_PASSWORD'),
    ); // ¡Cuidado con esto en producción!
    console.log('--- Fin Debug de Conexión a DB ---');
  }
}
