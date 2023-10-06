"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const graphql_1 = require("@nestjs/graphql");
const fs_1 = require("fs");
const path_1 = require("path");
const graphql_2 = require("graphql");
const common_1 = require("@nestjs/common");
const transform_interceptor_1 = require("./transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3001);
    const { schema } = app.get(graphql_1.GraphQLSchemaHost);
    (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), `/src/schema.gql`), (0, graphql_2.printSchema)(schema));
}
bootstrap();
//# sourceMappingURL=main.js.map