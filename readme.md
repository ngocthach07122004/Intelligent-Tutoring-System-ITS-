Có vài hạn chế:

1. Private EC2 không pull Docker image được

→ Em phải copy app lên instance (scp, SSM, user_data)
→ Hoặc build JAR/Golang binary trực tiếp trên đó

2. Backend không gọi external APIs được

Muốn gọi OpenAI / MoMo / Stripe → phải bật NAT Gateway.

3. Không scale được

Vì không có ALB.

Nhưng mục tiêu của em:
Free-tier → tối ưu chi phí → hoàn toàn OK.