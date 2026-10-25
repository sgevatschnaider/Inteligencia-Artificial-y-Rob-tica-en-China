# Robotics, Automation, and Embodied AI

**[Español](../es/robotica-industria.md) · [Back to the overview](../../README.en.md)**

## Leadership at scale

China is the world's largest industrial-robot market. It installed about 354,000 units in 2025, 59% of the global total. Chinese suppliers held 55% of the domestic market. The operational stock of 2.027 million robots refers to 2024 and remains a historical observation.

This scale reflects electronics manufacturing, automotive production, metalworking, modernisation policy, local supply chains, and demographic and wage pressures. It does not mean that every factory is equally automated: adoption differs by province, company size, and sector.

## Four markets that should not be conflated

### Industrial robots

Arms, cells, and integrated systems for welding, handling, assembly, painting, inspection, and palletising. This is the segment with the most comparable installation metrics.

### Mobile and service robots

Autonomous mobile robots for factories and warehouses, last-mile delivery, cleaning, hospitality, inspection, and security. Units differ greatly in complexity and price, so robot counts are misleading unless the category is defined.

### Quadrupeds and drones

Platforms for inspection, mapping, agriculture, emergency response, and data collection. Unitree, DJI, and XAG occupy distinct positions within this broad group.

### Humanoids

The field combines locomotion, manipulation, perception, planning, and learning from demonstrations or simulation. Public demonstrations are advancing quickly; the more meaningful indicators are reliability, mean time between failures, safety, cycle time, ease of retraining, and total cost of ownership.

## Selected companies

- **Unitree:** H1 and G1 humanoids; Go and B quadrupeds.
- **UBTECH:** Walker S systems for industrial settings.
- **AgiBot/Zhiyuan:** humanoid platforms and robot-data generation.
- **Fourier Intelligence:** rehabilitation systems and GR humanoids.
- **XPENG Robotics:** IRON and physical-AI development connected to its vehicle platform.
- **SIASUN and Estun:** industrial robotics and automation.
- **Inovance:** motion control, servo systems, and automation.
- **DJI and XAG:** aerial robotics and precision agriculture.

XPENG's flying-car activity belongs to AEROHT/ARIDGE. “ALEVEN,” which appeared in an earlier README, was incorrect.

## The central bottleneck: interaction data

Language models learn from large digital corpora; robots require data connecting perception, state, action, and physical outcome. Such data are expensive, hardware-dependent, and safety-sensitive. Strategies include teleoperation, imitation learning, simulation, synthetic data, reinforcement learning, and connected fleets.

A data flywheel is not automatic. It exists only when use produces relevant data, the data improve the system, and that improvement increases useful adoption without degrading safety, privacy, or quality.

## Indicators for evaluating deployments

- units delivered and accepted by customers, rather than announced capacity;
- productive operating hours;
- availability and frequency of human intervention;
- task-success rate under defined operating conditions;
- integration and reprogramming time;
- total cost of ownership and payback period; and
- safety incidents and standards compliance.

Principal statistical source: [IFR World Robotics 2026](https://ifr.org/downloads/press_docs/EN-2026-SEP-24-IFR_Press_Release_WR-CHINA.pdf).

## Comparable indicators

Installation volume and domestic supplier share need separate denominators. The latter moved from 57% in 2024 to 55% in 2025. The United States installed about 38,400 robots in 2025. See the [source registry](../../data/indicadores-2026.json) and the [visual overview](https://sgevatschnaider.github.io/Inteligencia-Artificial-y-Rob-tica-en-China/recursos/Panorama_Industrial_2026.html).

## Labs for comparing assumptions

[Original RobotLab](../../robotlab/index.html?lang=en) · [Class 2: energy, valid tasks and costs](../../materiales/clase-2/lab.html?lang=en) · [Video observation guide](../../materiales/clase-2/videos.html?lang=en). Lab models are hypothetical and not calibrated to manufacturer data.
