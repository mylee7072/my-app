FROM node:16-alpine

WORKDIR /app

copy package.json package-lock.json ./

# RUN NPM install // 원래는 npm ci 를 사용해야 하지만, npm ci는 package-lock.json이 있어야 합니다. 만약 package-lock.json이 없다면 npm install을 사용해야 합니다. 
RUN npm ci

copy index.js ./ /app/

ENTRYPOINT [ "node", "index.js" ]  

#  Dockerfile은 애플리케이션을 컨테이너화하기 위한 설정 파일입니다. 이 파일은 Node.js 애플리케이션을 실행하기 위한 환경을 설정하고, 필요한 파일들을 복사하며, 애플리케이션을 실행하는 명령을 정의합니다.
#  위의 Dockerfile은 Node.js 16 버전을 기반으로 하며, 작업 디렉토리를 /app으로 설정하고, package.json과 package-lock.json 파일을 복사한 후, npm ci 명령을 실행하여 의존성을 설치합니다. 마지막으로 index.js 파일을 복사하고, 컨테이너가 시작될 때 node index.js 명령을 실행하도록 설정합니다.                 
# Dockerfile을 사용하여 이미지를 빌드하려면 다음 명령을 실행합니다:
# docker build -t my-node-app .
# 위 명령은 현재 디렉토리에 있는 Dockerfile을 사용하여 my-node-app이라는 이름의 이미지를 빌드합니다. 빌드가 완료되면, 다음 명령을 사용하여 컨테이너를 실행할 수 있습니다:
# docker run -p 3000:3000 my-node-app
# 위 명령은 my-node-app 이미지를 기반으로 컨테이너를 실행하고
# 호스트의 3000 포트를 컨테이너의 3000 포트에 매핑합니다. 이제 브라우저에서 http://localhost:3000을 열면 "Hello World!" 메시지를 볼 수 있습니다.
# Dockerfile을 사용하여 이미지를 빌드하고 컨테이너를 실행하는 과정은 애플리케이션을 쉽게 배포하고 실행할 수 있도록 도와줍니다. Docker는 애플리케이션과 그 환경을 패키징하여 일관된 실행 환경을 제공하므로, 개발자와 운영팀 모두에게 유용한 도구입니다.

# lay 0 ~ 1 : FROM node:16-alpine == base image로 Node.js 16 버전을 사용하여 가볍고 효율적인 Alpine Linux 기반 이미지를 선택합니다.
# lay 2 ~ 3 : WORKDIR /app ==  작업 디렉토리를 /app으로 설정하여 이후의 명령들이 이 디렉토리에서 실행되도록 합니다. 이는 애플리케이션 파일들을 이 디렉토리에 복사하고 실행하기 위한 준비 단계입니다.
# lay 4 ~ 5 : copy package.json package-lock.json ./ ==  package.json과 package-lock.json 파일을 현재 디렉토리에서 컨테이너의 /app 디렉토리로 복사합니다. 이 파일들은 애플리케이션의 의존성을 정의하는 중요한 파일입니다.
# lay 6 ~ 7 : RUN NPM ci    ==  npm ci 명령을 실행하여 package-lock.json 파일에 정의된 정확한 버전의 의존성을 설치합니다. 이는 일관된 빌드 환경을 보장하기 위해 사용됩니다. 만약 package-lock.json이 없다면 npm install을 사용해야 합니다.
# lay 8 ~ 9 : copy index.js ./ /app/ ==  index.js 파일을 현재 디렉토리에서 컨테이너의 /app 디렉토리로 복사합니다. 이 파일은 애플리케이션의 진입점으로, 서버를 시작하는 역할을 합니다.
# lay 10 ~ 11 : ENTRYPOINT [ "node", "index.js" ] ==  컨테이너가 시작될 때 node index.js 명령을 실행하도록 설정합니다. 이는 애플리케이션이 컨테이너가 시작되자마자 실행되도록 보장합니다. ENTRYPOINT는 컨테이너의 기본 실행 명령을 정의하는 데 사용됩니다.