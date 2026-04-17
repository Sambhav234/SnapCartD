import React from 'react'
import { IOrder } from './AdminOrderCard'
import { UserCheck } from 'lucide-react'
function InfoBtn({order}:{order:IOrder}) {
  return (
    <div>
    {order.assignedDeliveryBoy && order.status=="out of delivery" && <div className='mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3 text-sm text-gray-700'>
                  <UserCheck className="text-blue-600" size={18}/>
                  <div className='font-semibold text-gray-800'>
                    <p className=''>Assigned to : <span>{order.assignedDeliveryBoy.name}</span></p>
                    <p className='text-xs text-gray-600'>📞 +91 {order.assignedDeliveryBoy.mobile}</p>
                  </div>
                </div>

                <a href={`tel:${order.assignedDeliveryBoy.mobile}`} className='bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition'>Call</a>
                </div>}
    </div>

  )
}

export default InfoBtn
