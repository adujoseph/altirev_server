// import type { INestApplication } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { RedocModule, RedocOptions } from '@jozefazz/nestjs-redoc';
// import * as process from 'node:process';

// export async function setupRedoc(app: INestApplication<any>) {
//     const documentBuilder = new DocumentBuilder()
//         .setTitle('Altirev API')
//         .setDescription(
//             `Altirev Platform API Documentation\n
//              The Altirev API gives you access to pretty much all the features you can use on our dashboard\n
//              and lets you extend them for use in your application. It strives to be RESTful and is organized\n
//              around the main resources you would be interacting with - with a few notable exceptions.`,
//         )
//         .addBearerAuth(
//             {
//                 description: `Please enter token in following format: Bearer <JWT>`,
//                 name: 'Authorization',
//                 bearerFormat: 'Bearer',
//                 scheme: 'Bearer',
//                 type: 'http',
//                 in: 'Header',
//             },
//             'access-token',
//         );
//     const document = SwaggerModule.createDocument(app, documentBuilder.build());

//     const redocOptions: RedocOptions = {
//         hideDownloadButton: true,
//         // onlyRequiredInSamples: true,
//         // title: 'IDCHECKS API Documentation',
//         logo: {
//             url: 'http://localhost:8082/public/images/logo-dark-full.png',
//             backgroundColor: '#d0e8c5',
//             altText: 'LOGO',
//         },
//         theme: {
//             typography: {
//                 fontSize: '15px',
//                 fontWeightBold: '600',
//             },
//             sidebar: {
//                 backgroundColor: '#d0e8c5',
//             },
//             rightPanel: {
//                 backgroundColor: '#01312b',
//             },
//         },
//         sortPropsAlphabetically: true,
//         hideHostname: false,
//         noAutoAuth: true,
//         pathInMiddlePanel: true,
//         // auth: {
//         //     enabled: true,
//         //     user: 'admin',
//         //     password: `TfsR132eda@`,
//         // },
//     };
//     await RedocModule.setup('docs', app, document, redocOptions);

//     console.info(
//         `Redoc Documentation: http://localhost:${process.env.PORT}/docs`,
//     );
// }


// "@jozefazz/nestjs-redoc": "^1.0.7",