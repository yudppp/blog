---
date: 2017-08-24T00:00:00+09:00
title: Kubernetesの成功したJobを消す
tags: ["kubernetes"]
---

Kubernetesで1日数百Jobを利用しているが、仕様上成功済みのJobが消えない。

そのため大量の不要になったJobを消したい。


### CLI 

2時間以上たった成功済みのJobを消したい時

```
 kubectl get job |  awk '{ if(match($4, /^([2-9]h|[1-2][0-9]h|[0-9]+d)$/) && ($3==1)) print $1}' | xargs -P 8 -n 1 --no-run-if-empty kubectl delete job
```

### Pod(Docker) 

10分に1回2時間以上たった成功済みのJobを消すPodのDockerfile

```
FROM alpine

ENV KUBECTL_VERSION v1.5.3

ADD https://storage.googleapis.com/kubernetes-release/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl /bin/kubectl
RUN chmod +x /bin/kubectl

# Delete successed job after 2 hours ago
CMD while true; do kubectl get job |  awk '{ if(match($4, /^([2-9]h|[1-2][0-9]h|[0-9]+d)$/) && ($3==1)) print $1}' | xargs -n 1 --no-run-if-empty kubectl delete job; sleep 600s; done
```

https://gist.github.com/yudppp/4e386d8c55d70d65e135321252b1a9ae


### CronJob

動作確認していないのですがこんな感じでしょうか

```
apiVersion: batch/v2alpha1
kind: CronJob
metadata:
  name: kubejobremover
spec:
  schedule: "*/10 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: kubejobremover
            image: wernight/kubectl:1.5.3
            args:
            - /bin/sh
            - -c
            - kubectl get job |  awk '{ if(match($4, /^([2-9]h|[1-2][0-9]h|[0-9]+d)$/) && ($3==1)) print $1}' | xargs -n 1 --no-run-if-empty kubectl delete job
          restartPolicy: OnFailure
```

本来CronJobでやりたかったのですが `--enable-kubernetes-alpha` していなかったので一旦諦めてdeploymentに上記のPodを作成して対応した。
