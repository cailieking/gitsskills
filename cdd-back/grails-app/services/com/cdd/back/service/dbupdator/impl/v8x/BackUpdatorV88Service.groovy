package com.cdd.back.service.dbupdator.impl.v8x

import com.cdd.back.service.dbupdator.AbstractBackDatabaseUpdator
import com.cdd.back.util.MenuHelper
import com.cdd.base.domain.Menu;
import com.cdd.base.domain.Requestmap
import com.cdd.base.domain.User
import com.cdd.base.enums.AgentType;

class BackUpdatorV88Service extends AbstractBackDatabaseUpdator {
	@Override
	def updateSchema() {
		def sqls = []
		
		sqls << """
			ALTER TABLE `inquery_price` MODIFY `last_updated` datetime null;
		"""
		
		sqls << """
			ALTER TABLE `order_price` MODIFY `last_updated` datetime null;
		"""
		
		return sqls
	}

	@Override
	def updateData() {
		return null
	}

	@Override
	public int getOrder() {
		return 88
	}
}
