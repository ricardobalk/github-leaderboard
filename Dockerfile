FROM node:14 as node14-base

USER node
RUN mkdir -p  /home/node/.npm-global \
              /home/node/app
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$NPM_CONFIG_PREFIX/bin:$PATH
RUN npm -g config set user "$USER" && \
    printf "Node version %s, npm version %s, yarn version %s\n\n" "$(node -v)" "$(npm -v)" "$(yarn -v)"

FROM node14-base as node-deps
WORKDIR /home/node/app/
COPY . .
RUN yarn

ENTRYPOINT ["yarn", "run"]

FROM node-deps as node-devenv
EXPOSE 3000
CMD ["dev"]

FROM node-deps as node-build
CMD ["build"]