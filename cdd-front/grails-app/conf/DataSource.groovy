
import grails.util.Environment

/**
 * only need to configure this part
 *
 */

def dataSources = [
	[name: 'dataSource']
	// add more dataSource here
]

def getDatabaseConfig() {
	switch(Environment.current.name) {
	case Environment.DEVELOPMENT.name:
	case 'development':
	
		//return [username: 'cdd_dev', password: 'cdd-dev', host: '120.25.103.111:3306', uri: 'chuanduoduo_dev']
	return [username: 'root', password: 'root', host: 'localhost:3306', uri: 'zhaochuan1123']
	case Environment.TEST.name:
		return [username: 'root', password: '111111', host: 'localhost:3306', uri: 'cdd']
	case 'uat':
		return [username: 'cdd_test', password: 'cddtest', host: 'chuanduoduo.mysql.rds.aliyuncs.com:3306', uri: 'chuanduoduo_test']
	case Environment.PRODUCTION.name:
		return [username: 'cdd_admin', password: 'cddr00t', host: 'rdsm7t7ws24l5djgte0g6.mysql.rds.aliyuncs.com:3306', uri: 'chuanduoduo']
	}
}

/**
 * configure when needed, otherwise no need to do
 */

hibernate {
	cache.use_second_level_cache = true
	cache.use_query_cache = false
	//    cache.region.factory_class = 'net.sf.ehcache.hibernate.EhCacheRegionFactory' // Hibernate 3
	cache.region.factory_class = 'org.hibernate.cache.ehcache.EhCacheRegionFactory' // Hibernate 4
	// we dont need OSIV
	//    singleSession = true // configure OSIV singleSession mode
	//    flush.mode = 'manual' // OSIV session flush mode outside of transactional context
//	hbm2ddl.auto = 'update'
	show_sql = false
}


/**
 * no need to configure below
 */

def dataSourceSetting(dataSources, setting) {
	dataSources.each {
		delegate."${it.name}" {
			if(setting.properties) {
				properties setting.properties
			}
			if(setting.dbCreate) {
				dbCreate = setting.dbCreate
			}
			pooled = true
			driverClassName = 'com.mysql.jdbc.Driver'
			dialect = org.hibernate.dialect.MySQL5InnoDBDialect
			username = setting.username
			password = setting.password
			url = "jdbc:mysql://${setting.host}/${setting.uri}?autoReconnect=true&socketTimeout=200000&useUnicode=true&characterEncoding=UTF-8"
		}
	}
}


def devDataSourceSetting = {
	// we need to pass the dataSources collection explicitly
	def setting = getDatabaseConfig()
	dataSourceSetting(dataSources, setting)
}

def nonDevDataSourceSetting(dataSources, setting) {
	return {
		setting.properties = {
			// See http://grails.org/doc/latest/guide/conf.html#dataSource for documentation
			jmxEnabled = true
			initialSize = 5
			maxActive = 50
			minIdle = 5
			maxIdle = 30
			maxWait = 10000
			maxAge = 10 * 60000
			timeBetweenEvictionRunsMillis = 5000
			minEvictableIdleTimeMillis = 60000
			validationQuery = 'SELECT 1'
			validationQueryTimeout = 3
			validationInterval = 15000
			testOnBorrow = true
			testWhileIdle = true
			testOnReturn = false
			jdbcInterceptors = 'ConnectionState'
			defaultTransactionIsolation = java.sql.Connection.TRANSACTION_READ_COMMITTED
		}
		dataSourceSetting(dataSources, setting)
	}
}

// environment specific settings
environments {
	development nonDevDataSourceSetting(dataSources, getDatabaseConfig())
	test devDataSourceSetting
	uat nonDevDataSourceSetting(dataSources, getDatabaseConfig())
	production nonDevDataSourceSetting(dataSources, getDatabaseConfig())
}
