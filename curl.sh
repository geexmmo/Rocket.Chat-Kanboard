curl \
-u "jsonrpc:183802e14c2601b77a44b413484110e5c1cb7227bfba3f6ca05d01d5c515" \
-d '{"jsonrpc": "2.0","method": "moveTaskPosition","id": 2,"params": {"project_id": 6,"task_id": "928","column_id": 29, "position": 1,"swimlane_id": 0}}' \
http://task.backend.mypizza.kg/jsonrpc.php

# -d '{"jsonrpc": "2.0", "method": "getAllProjects", "id": 1}' \,