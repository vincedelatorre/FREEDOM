# Copyright (c) 2026 TOYOTA MOTOR CORPORATION. ALL RIGHTS RESERVED.
# SPDX-License-Identifier: Apache-2.0

from src import freedom, job, infrastructure, robot, equipment


# node structure
structure = {
    infrastructure: [
        infrastructure.lamp,
        infrastructure.shutter,
        infrastructure.gate,
        infrastructure.intersection,
    ],
    equipment: [
        equipment.database,
        equipment.iotdatashare,
        equipment.plc
    ],
    robot: [
        robot.dummy,
    ],
    job: [
        job.active,
        job.create
    ]
}

# freedom.main domain
main = freedom.main.Domain(
    interface = "Dummy",    # Interface name
    dsn = "database://user:password@host:port/dbname",  # Database DSN
    schema = "public",  # schema name
    table = "freedom_main", # table name
    update_cycle = 10,  # Update cycle in seconds
)

# freedom.user_interface domain
user_interface = freedom.user_interface.Domain(
    ip = "localhost",  # IP address
    port = 8080,  # Port
    origin = ["http://localhost:3000"]  # Allowed origins for CORS
)


# --- dummy config only ---
# dummy database
import dataclasses
freedom_main = {
    freedom.map: dataclasses.asdict(freedom.map.Domain(
        default_view = freedom.map.domain.DefaultView([35.02345408903063, 137.13061702903593], 15, 0.0)
    )),
    infrastructure.lamp: dataclasses.asdict(infrastructure.lamp.Domain([
        dataclasses.asdict(infrastructure.lamp.NodeDomain(enable=True, name="lamp_1", interface="Dummy")),
        dataclasses.asdict(infrastructure.lamp.NodeDomain(enable=True, name="lamp_2", interface="Dummy")),
        dataclasses.asdict(infrastructure.lamp.NodeDomain(enable=True, name="lamp_3", interface="Dummy")),
    ])),
    infrastructure.shutter: dataclasses.asdict(infrastructure.shutter.Domain([
        dataclasses.asdict(infrastructure.shutter.NodeDomain(enable=True, name="shutter_1", interface="Dummy",)),
    ])),
    infrastructure.gate: dataclasses.asdict(infrastructure.gate.Domain([
        dataclasses.asdict(infrastructure.gate.NodeDomain(enable=True, name="gate_1", interface="Dummy",)),
    ])),
    infrastructure.intersection: dataclasses.asdict(infrastructure.intersection.Domain([
        dataclasses.asdict(infrastructure.intersection.NodeDomain(enable=True, name="intersection_1",)),
    ])),
    robot.dummy: dataclasses.asdict(robot.dummy.Domain([
        dataclasses.asdict(robot.dummy.NodeDomain(enable=True, name="robot_dummy_1")),
        dataclasses.asdict(robot.dummy.NodeDomain(enable=True, name="robot_dummy_2")),
        dataclasses.asdict(robot.dummy.NodeDomain(enable=True, name="robot_dummy_3")),
    ]))
}

job_active = []
job_create = []
