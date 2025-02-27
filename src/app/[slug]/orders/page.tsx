import { db } from "@/lib/prisma";

import { isValidCpf, removeCpfPunctuation } from "../menu/helpers/cpf";
import CpfForm from "./components/cpf-form";
import OrderList from "./components/order-list";
import { ConsumptionMethod } from "@prisma/client";

interface OrdersPageProps {
   searchParams: Promise<{ 
    cpf: string, 
    consumptionMethod: ConsumptionMethod
  }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf, consumptionMethod } = await searchParams;

  if (!cpf) {
    return <CpfForm consumptionMethod={consumptionMethod} />;
  }
  if (!isValidCpf(cpf)) {
    return <CpfForm consumptionMethod={consumptionMethod} />;
  }

  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      customerCpf: removeCpfPunctuation(cpf),
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
          slug: true
        },
      },
      orderProducts: {
        include: {
          product: true,
        },
      },
    },
  });

  return <OrderList orders={orders} />;
};

export default OrdersPage;