# BackEnd

En el archivo **configdb.sh** estan las instrucciones para ejecutar
 el backend con docker y con virtualenv  

--- 
##### Instalar docker
```bash
sudo apt install docker.io -y
```
-  Y luego seguir los 3 primeros pasos [aca](https://docs.docker.com/engine/install/linux-postinstall/)


---
##### Para crear un entorno virtual:

- instalar:
```bash
sudo apt install virtualenv -y
```
- crear el entorno con python 3
```bash
virtualenv -p python3 venv
```
- activar e instalar librerias
```bash
. venv/bin/activate
pip install -r requirements.txt
``` 

