FROM node:8.3-alpine
ARG PORT=3000
ENV PORT $PORT
ENV serverApp adminGuiServer
EXPOSE $PORT
ADD ./index.js /code/
ADD ./build/ /code/build/
ADD ./build_node_modules/node_modules/ /code/node_modules/
# Only for GUI, as docker does not have conditionals - we include them in every build
ADD ./dist/ /code/dist/
ADD ./public/ /code/public/
ADD ./adminGuiServer/views/ /code/views/

RUN apk add --update bash && rm -rf /var/cache/apk/*

ADD ./utils/deploy/setup_docker_env.sh /
RUN chmod +x /setup_docker_env.sh
RUN /setup_docker_env.sh "/code"

WORKDIR /code
CMD ["node", "index"]
