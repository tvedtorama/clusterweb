

### Deployment

    git pull
	... do that copy files and npm install thing.
	tsc
	webpack --config webpack.prod.config.js
	docker build -t tvedtorama/clusterweb .
	docker push tvedtorama/clusterweb

	docker pull tvedtorama/clusterweb
	docker service create --name clusters-gui --network proxy  --network services   --label com.df.notify=true     --label com.df.distribute=true   --label com.df.serviceDomain=clusters.phil.network --label com.df.port=3000 --label com.df.httpsOnly=true  --replicas=2  --with-registry-auth tvedtorama/clusterweb:latest 