# Companies, Models, and AI Infrastructure

**[Español](../es/empresas-modelos.md) · [Back to the overview](../../README.en.md)**

## How to interpret the market

China's ecosystem is not adequately described by a simple division between “technology giants” and “start-ups.” Five layers are more useful: foundation models, cloud and distribution, semiconductors, vertical applications, and the developer community. A company may be strong in one layer while relying on competitors in another.

The terms *open source*, *open weights*, and *API access* should not be used interchangeably. A model may permit weight downloads without disclosing training data or complete training code; another may be available only through a managed service.

## Foundation models and platforms

| Organisation | Families or products | Ecosystem position |
|---|---|---|
| Alibaba Cloud | Qwen | Language, coding, vision, and audio models; international distribution and numerous open-weight variants. |
| DeepSeek | V3, R1, and derivatives | General and reasoning-oriented models, technical reports, and a major influence on debates about efficiency and openness. |
| Baidu | ERNIE | Models and applications connected to search, cloud, and enterprise services. |
| ByteDance | Doubao and Seed | Consumer products and multimodal models supported by ByteDance's distribution. |
| Zhipu AI | GLM | Foundation models, assistants, agents, and enterprise offerings. |
| Moonshot AI | Kimi | Consumer products and long-context systems. |
| MiniMax | Text, speech, music, and video families | A multimodal strategy spanning consumer and developer products. |
| Huawei | Pangu | Sector-specific models combined with Huawei Cloud and Ascend infrastructure. |
| Tencent | Hunyuan | Models integrated with cloud, social platforms, content, and enterprise applications. |

Names and versions evolve rapidly. This repository refers to product families rather than declaring one release “the best” without a dated, reproducible evaluation.

## Semiconductors and compute

Export controls covering advanced accelerators and semiconductor-manufacturing equipment are a structural variable. Chinese responses include domestic substitution, software optimisation, specialised designs, accelerator clustering, and greater emphasis on training and inference efficiency.

Relevant actors include Huawei Ascend, Cambricon, Biren, and domestic equipment and component suppliers. Announced chip capability is not equivalent to large-scale availability: system performance, memory, interconnects, software tooling, manufacturing yield, and energy access are equally important.

## Distribution and monetisation

Principal routes to market include:

- cloud services and APIs;
- consumer assistants;
- enterprise tools and agents;
- integration into e-commerce, social media, and productivity suites;
- models deployed in devices and vehicles; and
- sector-specific services for manufacturing, healthcare, and science.

The market is marked by intense price competition. Sustainable performance should be evaluated through revenue, recurring use, inference costs, and the ability to convert free adoption into economic value.

## Evaluation criteria

1. **Capability:** demonstrated quality on relevant tasks, not a single benchmark.
2. **Access:** API, licence, weights, documentation, and use restrictions.
3. **Infrastructure:** hardware, cloud, tooling, and regional availability.
4. **Distribution:** users, enterprise channels, and developer ecosystem.
5. **Compliance:** privacy, security, filing, and sectoral rules.
6. **Economics:** price, operating cost, revenue, and dependence on subsidies.

## Selected primary links

- [Qwen](https://qwen.ai/)
- [DeepSeek](https://www.deepseek.com/)
- [Baidu ERNIE](https://yiyan.baidu.com/)
- [Zhipu AI](https://www.zhipuai.cn/)
- [Moonshot AI](https://www.moonshot.cn/)
- [Huawei Pangu](https://www.huaweicloud.com/intl/en-us/product/pangu.html)

Corporate sites establish the existence and stated description of products. They are not treated as independent proof of leadership, adoption, or economic performance.

## Semiconductor supply-chain layers

| Actor or layer | Distinct function | Relevant constraint |
|---|---|---|
| Huawei Ascend, Cambricon | Accelerator design and software platform | Memory, interconnects, tools and system availability |
| SMIC | Contract manufacturing | Equipment, materials, yields and production capacity |
| CXMT | DRAM memory | Process, quality, scale and workload suitability |
| YMTC | NAND memory | Architecture, integration and production |
| Packaging and equipment | Physical integration and fabrication | Suppliers, precision, lead times and maintenance |
| Data centres and power | Operating infrastructure | Power, networks, cooling and utilisation |

A chip specification does not measure full-system performance. Compare workload performance, memory, communication, energy efficiency and development tools. This is a functional map, not a version or capacity ranking.

## Class 2: models and agent systems

[Decks and teaching notes](../../materiales/clase-2/index.html?lang=en) · [Agent foundations](../../materiales/clase-2/reader.html?deck=agents&lang=en) · [Tools and evidence exercise](../../materiales/clase-2/lab.html?lang=en).
