package com.cdd.back.service.dbupdator.impl.v7x

import com.cdd.back.service.dbupdator.AbstractBackDatabaseUpdator
import com.cdd.base.domain.Requestmap
import com.cdd.base.domain.User

class BackUpdatorV72Service extends AbstractBackDatabaseUpdator {

	@Override
	def updateSchema() {
		def sqls = []
		sqls << """
			ALTER TABLE `company_certificate` DROP COLUMN `image` ,
											  DROP COLUMN `company_id` ;
		"""
		return sqls
	}

	@Override
	def updateData() {
		return null
	}

	@Override
	public int getOrder() {
		return 72
	}
}
