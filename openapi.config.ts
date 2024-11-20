// abstract
//todo 自动生成axios每个 发送请求需要的代码

const { generateService } = require("@umijs/openapi");

/*generateService 是 @umijs/openapi 库提供的一个方法，用来生成与 OpenAPI 文档匹配的前端请求代码。这个方法会根据你提供的 API 文档和请求库
，生成相应的 TypeScript 或 JavaScript 请求服务代码。*/

generateService({
  requestLibPath: "import request from '@/libs/request'",
  //发送请求的库在哪 你依赖于什么发请求 这里肯定是封装了axios
  //生成代码的时候 用这个库来发送请求
  schemaPath: "http://localhost:8101/api/v2/api-docs",
  //todo 后端生成的接口文档的 地址
  //调用后端请求的js方法
  //   Swagger 或其他 OpenAPI 生成工具提供的 RESTful API 接口
  serversPath: "./src",
  //生成的服务代码在哪 生成的目录

  //     运行命令"openapi": "node openapi.config.ts"
});
