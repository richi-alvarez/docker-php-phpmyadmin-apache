#!/bin/bash

# Iniciar el servicio cron en segundo plano
#service cron start

# Mostrar los procesos activos para depuración (opcional)
ps aux | grep aux

# Iniciar Apache en primer plano
apache2-foreground