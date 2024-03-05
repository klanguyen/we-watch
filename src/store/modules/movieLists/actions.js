export default {
    async createList(context, data) {
        const userId = context.rootGetters.userId;
        const listData = {
            title: data.listTitle,
            description: data.listDescription,
            isPublic: data.isPublic
        }

        //const response = await fetch()
    }
}
