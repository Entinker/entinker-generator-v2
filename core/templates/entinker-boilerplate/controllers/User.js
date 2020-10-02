const bcrypt = require('bcrypt')

const returnHashedPasword = async (userPasword) => {

  const password = userPasword

  const salt = await bcrypt.genSalt(10)

  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

const Create = async (user, model = db) => {
  return model('user').insert(user)
}

const FetchAll = async (model = db) => {
  return model('user').select('user_id', 'display_name', 'phone', 'user_type', 'is_active', 'created_at', 'updated_at')
}

const FetchById = async (user_id, model = db) => {
  return model('user')
    .select('user_id', 'display_name', 'phone', 'user_type', 'is_active', 'created_at', 'updated_at')
    .where({
      user_id
    }).first()
}

/**
 * 
 * @param {Object} condition - condition to check privileges
 * @param {Number} condition.user_id - Id of user to check for privilege
 * @param {String} condition.privileges - privilege to check
 * @param {Number} condition.restaurant_id - Id of restaurant user associated with 
 *
 * @param {*} [model=db] - Database Model 
 */
const hasPrivilege = async (condition, model = db) => {

  const {
    access_id,
    privileges,
    restaurant_id
  } = condition

  const where_condition = {
    access_id
  }

  if (restaurant_id)
    where_condition.restaurant_id = restaurant_id


  const has_access = await model('access')
    .select(model.raw(`IF(ISNULL(JSON_SEARCH(privileges,"one",'${privileges}')),0,1) AS has_access`))
    .where(where_condition)
    .limit(1)

  console.log(has_access)
  if (has_access.length == 0) {
    return 0
  } else if (has_access[0].has_access == 1) {
    return true
  } else {
    false
  }
}

const login = async (credentials, model = db) => {

  let {
    phone,
    password
  } = credentials

  let is_active = 1

  let user_data = await model('user').select('user_id', 'password', 'user_type').where({
    phone,
    is_active
  }).first()


  if (user_data) {

    let {
      user_id,
      password: hash_password,
      user_type
    } = user_data

    let isValidCredentials = await bcrypt.compare(password, hash_password)

    if (isValidCredentials) {

      let access = await model('access').select('access_id', 'restaurant_id').where({
        user_id
      })

      return {
        access,
        isValid: true,
        message: null,
        user_type,
      }
    } else {
      return {
        access_id: null,
        isValid: false,
        message: "Password not correct"
      }
    }
  } else {
    return {
      access_id: null,
      isValid: false,
      message: "No user exists with the phone number"
    }
  }


}

const setDefaultAccess = async (user, model = db) => {

  let {
    restaurant_id,
    user_id,
    user_type
  } = user

  let privileges = []

  user_type = parseInt(user_type)

  // 0 - tab , 1 - admin, 2 - manager, 3 - staff, 4 - chef, 5 - finss_agent

  switch (user_type) {

    case 0:
      privileges = `["view_menu_category", "view_menu", "create_order"]`
    case 1:
      privileges = `["add_user", "edit_user", "delete_user","add_restaurant", "edit_restaurant", "delete_restaurant", "view_restaurant","add_menu_category", "edit_menu_category", "delete_menu_category", "view_menu_category", "add_menu", "edit_menu", "delete_menu", "view_menu", "add_table", "edit_table", "delete_table", "edit_store_setting", "add_inventory", "edit_inventory", "add_unit", "create_order", "read_order", "update_order", "grant_access", "revoke_access"]`
      break
    case 2:
      privileges = `["add_user", "edit_user", "delete_user", "edit_restaurant", "view_restaurant","add_menu_category", "edit_menu_category", "delete_menu_category", "view_menu_category", "add_menu", "edit_menu", "delete_menu", "add_table", "edit_table", "delete_table","view_menu", "edit_store_setting", "add_inventory", "edit_inventory","add_unit", "create_order", "read_order", "update_order"]`
      break
    case 3:
      privileges = `["read_order", "update_order"]`
      break
    case 4:
      privileges = `["create_order", "read_order", "update_order"]`
      break
    case 5:
      privileges = `["view_all_restaurants", "view_tables", "setup_tab"]`

  }

  return model('access').insert({
    restaurant_id,
    user_id,
    privileges
  })
}

const Edit = async (user, model = db) => {

  let {
    user_id,
    display_name,
    phone
  } = user

  return model('user').where({
    user_id
  }).update({
    display_name,
    phone
  })

}

const Delete = async (user_id, model = db) => {

  let is_active = 0

  return model('user').where({
    user_id
  }).update({
    is_active
  })
}

const UserExists = async (user_id, model = db) => {


  let userExists = await model('user').select(model.raw(true)).where({
    user_id,
  }).first()

  if (userExists) {
    return {
      exists: true,
      message: null
    }
  } else {
    return {
      exists: false,
      message: "No user exists with the ID"
    }
  }

}


const EditAccess = async (user_id, model = db) => {

}

module.exports = {
  FetchAll,
  Create,
  FetchById,
  hasPrivilege,
  login,
  returnHashedPasword,
  setDefaultAccess,
  Edit,
  Delete,
  UserExists,
  EditAccess
}