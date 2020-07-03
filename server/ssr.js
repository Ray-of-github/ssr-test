import clientRoutes from "../src/route";
import React, { createElement } from "react";
import RenderUI from "./components/renderUI";
import { match as matchRoutes, RouterContext } from "react-router";
import { renderToString } from "react-dom/server";
import Foo from "../src/foo";
const path = require("path");
const fs = require("fs");

// global
// let clientRoutes = []

const template = fs.readFileSync(
  path.resolve(__dirname, "../build/index.html"),
  "utf8"
);

const isPageRequest = (req) => /text\/html/.test(req.headers.accept);

export default (app) => {
  console.log("x-web start");

  // 提供给 m-web 的接口
  app.get("/content", (req, res) => {
    res.send(renderToString(<Foo />));
  });

  app.post("/patchRoute", (req, res) => {
    console.log("req is: ", req.body);
    clientRoutes = req.body.data;
    res.send("oker");
  });

  app.use(async function (req, res, next) {
    if (clientRoutes.length === 0) {
      res.end("ok2");
      return;
    }
    console.log("Accept: ", /text\/html/.test(req.headers.accept));
    if (isPageRequest(req)) {
      console.log("clientRoutes: ", clientRoutes);
      const { path } = req;
      console.log("path is ", path);
      matchRoutes(
        { routes: clientRoutes, location: path },
        async (error, redirect, ssrData) => {
          // console.log("ssrData", ssrData);
          if (error) {
            error();
          } else if (redirect) {
            res.redirect(302, redirect.pathname + redirect.search);
          } else if (ssrData) {
            // 用于注水的数据
            const InitialProps = {};
            // 把所有匹配到的组件的 getInitialProps 方法调用一遍
            const getAllProps = ssrData.components.map((Com) => {
              return new Promise(async (resolve) => {
                let props = Com.getInitialProps
                  ? await Com.getInitialProps()
                  : {};

                if (InitialProps[Com.name]) {
                  InitialProps[Com.name].push(props);
                } else {
                  InitialProps[Com.name] = [props];
                }
                resolve((p) => {
                  const initialProps = { ...p, ...props };
                  return <Com {...initialProps} />;
                });
              });
            });

            const allProps = await Promise.all(getAllProps);
            allProps.forEach((com, idx) => {
              ssrData.components[idx] = com;
            });
            // components 的第一个元素就是 layout 组件, 相当于 next.js 中 page
            const Container = ssrData.components[0];
            let props = Container.getInitialProps
              ? await Container.getInitialProps()
              : {};
            ssrData.components[0] = (p) => {
              const initialProps = { ...p, ...props };
              return <Container {...initialProps} />;
            };

            // console.log("ssrData", ssrData);

            let Component = createElement(RouterContext, ssrData);

            const componentContent = renderToString(Component);

            // console.log("componentContent: ", componentContent);

            // console.log({ props });
            const mainContent = renderToString(
              <RenderUI content={componentContent} state={InitialProps} />
            );

            // console.log(mainContent);
            // res.end(mainContent);

            res.end(
              template.replace(/<div id="root"><\/div>/, `${mainContent}`)
            );
          } else {
            error();
          }
        }
      );
    }
  });
};
